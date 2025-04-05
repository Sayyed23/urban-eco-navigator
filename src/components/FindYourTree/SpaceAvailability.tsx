
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

type SpaceAvailabilityProps = {
  onSpaceChange: (space: number) => void;
};

const SpaceAvailability = ({ onSpaceChange }: SpaceAvailabilityProps) => {
  const [spaceValue, setSpaceValue] = useState([5]);
  
  const handleValueChange = (values: number[]) => {
    setSpaceValue(values);
    onSpaceChange(values[0]);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="space" className="block text-sm font-medium">
          Available Space
        </label>
        <span className="text-sm font-medium">{spaceValue[0]}m²</span>
      </div>
      <Slider 
        id="space" 
        min={1} 
        max={20} 
        step={1} 
        value={spaceValue}
        onValueChange={handleValueChange} 
        className="py-4"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1m²</span>
        <span>5m²</span>
        <span>10m²</span>
        <span>15m²</span>
        <span>20m²</span>
      </div>
    </div>
  );
};

export default SpaceAvailability;
