
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Droplets, ThermometerSun, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeBenefit = {
  name: string;
  level: "low" | "medium" | "high";
  icon: React.ReactNode;
};

export type Tree = {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  benefits: TreeBenefit[];
};

type TreeCardProps = {
  tree: Tree;
};

const TreeCard = ({ tree }: TreeCardProps) => {
  const getBenefitColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <img 
          src={tree.image} 
          alt={tree.name}
          className="h-full w-full object-cover" 
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold">{tree.name}</h3>
        <p className="text-xs text-muted-foreground italic">{tree.scientificName}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {tree.benefits.map((benefit, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center rounded-full px-2 py-0.5 text-xs",
                getBenefitColor(benefit.level)
              )}
            >
              {benefit.icon}
              <span className="ml-1">{benefit.level}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm">{tree.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full border-eco-green text-eco-green hover:bg-eco-light-green/10"
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TreeCard;
