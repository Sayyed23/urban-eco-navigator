import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Droplets, ThermometerSun, Wind, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LocationInput from "./LocationInput";

type TreePrediction = {
  id: string;
  name: string;
  scientificName: string;
  score: number;
  image: string;
};

const AutoMLPredictor = () => {
  const { toast } = useToast();
  const [aqi, setAqi] = useState<number[]>([50]); // default AQI: 50
  const [temperature, setTemperature] = useState<number[]>([20]); // default temperature: 20°C
  const [space, setSpace] = useState<number[]>([5]); // default space: 5m²
  const [location, setLocation] = useState("");
  const [predictions, setPredictions] = useState<TreePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
  };

  const handleGetPredictions = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enter a location before getting recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("predict-tree-suitability", {
        body: {
          aqi: aqi[0],
          temperature: temperature[0],
          space: space[0],
          location,
        },
      });

      if (error) {
        console.error("Error getting predictions:", error);
        toast({
          title: "Prediction Error",
          description: "Failed to get tree recommendations. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setPredictions(data.predictions);
    } catch (err) {
      console.error("Exception when getting predictions:", err);
      toast({
        title: "Service Error",
        description: "Our AutoML service is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-4 font-medium">AutoML Tree Predictor</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Our AI model predicts the best tree species for your environmental conditions.
        </p>

        <div className="mb-4">
          <LocationInput onLocationSelect={handleLocationSelect} />
        </div>

        <div className="mb-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="aqi" className="text-sm font-medium">
                <Wind className="mr-2 inline h-4 w-4" />
                Air Quality Index
              </label>
              <span className="text-sm">{aqi[0]}</span>
            </div>
            <Slider
              id="aqi"
              value={aqi}
              min={0}
              max={300}
              step={1}
              onValueChange={(values) => setAqi(values)}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Good (0)</span>
              <span>Moderate (50)</span>
              <span>Poor (150)</span>
              <span>Hazardous (300)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="temperature" className="text-sm font-medium">
                <ThermometerSun className="mr-2 inline h-4 w-4" />
                Average Temperature (°C)
              </label>
              <span className="text-sm">{temperature[0]}°C</span>
            </div>
            <Slider
              id="temperature"
              value={temperature}
              min={-10}
              max={40}
              step={1}
              onValueChange={(values) => setTemperature(values)}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-10°C</span>
              <span>10°C</span>
              <span>25°C</span>
              <span>40°C</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="space" className="text-sm font-medium">
                <Droplets className="mr-2 inline h-4 w-4" />
                Available Space
              </label>
              <span className="text-sm">{space[0]}m²</span>
            </div>
            <Slider
              id="space"
              value={space}
              min={1}
              max={20}
              step={1}
              onValueChange={(values) => setSpace(values)}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1m²</span>
              <span>5m²</span>
              <span>10m²</span>
              <span>20m²</span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleGetPredictions}
          disabled={isLoading || !location}
          className="w-full bg-eco-green hover:bg-eco-dark-green"
        >Get recommendations
        </Button>

        <Button 
          onClick={handleGetPredictions}
          disabled={isLoading || !location}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Get AI Recommendations
        </Button>
      </div>

      {predictions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Recommended Trees for {location}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {predictions.map((tree) => (
              <Card key={tree.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img src={tree.image} alt={tree.name} className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{tree.name}</h4>
                    <span className="rounded-full bg-eco-light-green px-2 py-0.5 text-xs font-semibold text-eco-dark-green">
                      {Math.round(tree.score)}% Match
                    </span>
                  </div>
                  <p className="text-xs italic text-muted-foreground">{tree.scientificName}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoMLPredictor;
