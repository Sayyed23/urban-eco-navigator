
import TreeCard, { Tree } from "./TreeCard";
import { Droplets, ThermometerSun, Wind } from "lucide-react";
import { useEffect, useState } from "react";

type RecommendationResultsProps = {
  isVisible: boolean;
  location: string;
};

const RecommendationResults = ({ isVisible, location }: RecommendationResultsProps) => {
  const [recommendedTrees, setRecommendedTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && location) {
      setLoading(true);
      
      // In a real application, this would be an API call using the location
      // to get tree recommendations based on climate data
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const treesForLocation: Tree[] = [
          {
            id: "1",
            name: "Red Maple",
            scientificName: "Acer rubrum",
            image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80",
            description: "Known for vibrant autumn colors. Adapts well to various soil conditions.",
            benefits: [
              { name: "Air Quality", level: "high", icon: <Wind className="h-3 w-3" /> },
              { name: "Shade", level: "high", icon: <ThermometerSun className="h-3 w-3" /> },
              { name: "Water", level: "medium", icon: <Droplets className="h-3 w-3" /> },
            ],
          },
          {
            id: "2",
            name: "River Birch",
            scientificName: "Betula nigra",
            image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80",
            description: "Excellent for wet areas with attractive peeling bark.",
            benefits: [
              { name: "Air Quality", level: "medium", icon: <Wind className="h-3 w-3" /> },
              { name: "Shade", level: "medium", icon: <ThermometerSun className="h-3 w-3" /> },
              { name: "Water", level: "high", icon: <Droplets className="h-3 w-3" /> },
            ],
          },
          {
            id: "3",
            name: "Green Giant Arborvitae",
            scientificName: "Thuja standishii × plicata",
            image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80",
            description: "Fast-growing evergreen perfect for privacy screens.",
            benefits: [
              { name: "Air Quality", level: "high", icon: <Wind className="h-3 w-3" /> },
              { name: "Shade", level: "low", icon: <ThermometerSun className="h-3 w-3" /> },
              { name: "Water", level: "low", icon: <Droplets className="h-3 w-3" /> },
            ],
          },
        ];
        
        setRecommendedTrees(treesForLocation);
        setLoading(false);
      }, 1000);
    }
  }, [isVisible, location]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 text-xl font-bold">Top Tree Picks for You</h2>
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-eco-green"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {recommendedTrees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationResults;
