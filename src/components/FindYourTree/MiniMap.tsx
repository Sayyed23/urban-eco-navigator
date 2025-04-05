
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type MiniMapProps = {
  isVisible: boolean;
  location: string;
};

const MiniMap = ({ isVisible, location }: MiniMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!isVisible || !location || !mapRef.current) return;
    setIsLoading(true);

    // Initialize Google Maps only when component is visible and has a location
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps script is already loaded
        if (!window.google || !window.google.maps) {
          // Fetch Google Maps API key from Supabase
          const { data: googleMapsApiKey, error } = await supabase
            .functions.invoke('get-google-maps-key');
          
          if (error || !googleMapsApiKey) {
            console.error("Error fetching Google Maps API key:", error);
            toast({
              title: "Error loading map",
              description: "Could not load the map. Please try again later.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey.key}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);

          return new Promise<void>((resolve) => {
            script.onload = () => resolve();
          });
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        toast({
          title: "Error loading map",
          description: "Could not load the map. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    const initMap = async () => {
      await loadGoogleMaps();
      
      if (!window.google || !window.google.maps) {
        setIsLoading(false);
        return;
      }
      
      // Use geocoding to convert address to coordinates
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        setIsLoading(false);
        
        if (status === "OK" && results && results[0]) {
          const { location: coords } = results[0].geometry;
          
          if (mapRef.current) {
            mapInstanceRef.current = new google.maps.Map(mapRef.current, {
              center: coords,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
            });

            // Add marker for the location
            new google.maps.Marker({
              position: coords,
              map: mapInstanceRef.current,
              title: "Planting Location",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#22c55e", // Green color
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 10
              }
            });
          }
        } else {
          console.error("Geocoding failed:", status);
          toast({
            title: "Error loading map",
            description: "Could not find the location on the map.",
            variant: "destructive",
          });
        }
      });
    };

    initMap();
  }, [isVisible, location]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="mb-4 text-xl font-bold">Planting Location</h2>
      <div className="overflow-hidden rounded-lg border">
        <div ref={mapRef} className="h-64 w-full bg-gray-100">
          {isLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-eco-green"></div>
            </div>
          )}
        </div>
        <div className="bg-white p-3">
          <div className="text-sm">
            <span className="font-medium">Selected Location:</span> {location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;
