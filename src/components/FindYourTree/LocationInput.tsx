
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google: any;
  }
}

type LocationInputProps = {
  onLocationSelect: (location: string) => void;
  initialLocation?: string;
};

const LocationInput = ({ onLocationSelect, initialLocation = "" }: LocationInputProps) => {
  const [location, setLocation] = useState(initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);
  const { toast } = useToast();
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteInstanceRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Set initial location if provided
    if (initialLocation && !location) {
      setLocation(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    const getGoogleMapsApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        
        if (error) {
          console.error("Failed to get Google Maps API key:", error);
          toast({
            title: "Error",
            description: "Could not load location services. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        
        if (data && data.key) {
          setGoogleMapsApiKey(data.key);
        }
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error);
      }
    };
    
    getGoogleMapsApiKey();
  }, [toast]);

  useEffect(() => {
    if (!googleMapsApiKey) return;
    
    // Load Google Maps JavaScript API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initAutocomplete;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [googleMapsApiKey]);

  const initAutocomplete = () => {
    if (autocompleteRef.current && window.google) {
      autocompleteInstanceRef.current = new google.maps.places.Autocomplete(
        autocompleteRef.current,
        { types: ["geocode"] }
      );

      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current?.getPlace();
        if (place && place.formatted_address) {
          setLocation(place.formatted_address);
          onLocationSelect(place.formatted_address);
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onLocationSelect(location);
    }
  };

  const useCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            if (!googleMapsApiKey) {
              setIsLoading(false);
              toast({
                title: "Error",
                description: "Location services are not available. Please try entering your location manually.",
                variant: "destructive",
              });
              return;
            }
            
            // Reverse geocoding to get address from coordinates
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted_address;
              setLocation(address);
              onLocationSelect(address);
            } else {
              // Fallback if geocoding fails
              setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              onLocationSelect(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } catch (error) {
            console.error("Error getting address:", error);
            // Fallback to coordinates
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            onLocationSelect(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please check your browser permissions.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="mb-6 space-y-2">
      <label htmlFor="location" className="block text-sm font-medium">
        Enter Your Location
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          id="location"
          ref={autocompleteRef}
          type="text"
          placeholder="City, postal code, or address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="bg-eco-green hover:bg-eco-dark-green">
          <MapPin className="mr-2 h-4 w-4" />
          Set
        </Button>
      </form>
      <Button
        type="button"
        variant="outline"
        onClick={useCurrentLocation}
        disabled={isLoading}
        className="w-full border-eco-green text-eco-green hover:bg-eco-light-green/10"
      >
        {isLoading ? "Getting location..." : "Use My Current Location"}
      </Button>
    </div>
  );
};

export default LocationInput;
