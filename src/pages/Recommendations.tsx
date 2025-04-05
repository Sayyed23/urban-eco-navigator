import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationInput from "@/components/FindYourTree/LocationInput";
import SpaceAvailability from "@/components/FindYourTree/SpaceAvailability";
import RecommendationResults from "@/components/FindYourTree/RecommendationResults";
import MiniMap from "@/components/FindYourTree/MiniMap";
import HowItWorks from "@/components/FindYourTree/HowItWorks";
import AutoMLPredictor from "@/components/FindYourTree/AutoMLPredictor";
import { Button } from "@/components/ui/button";

const Recommendations = () => {
  const [location, setLocation] = useState("");
  const [spaceAvailable, setSpaceAvailable] = useState(5);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [showAutoML, setShowAutoML] = useState(false);

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
  };

  const handleSpaceChange = (space: number) => {
    setSpaceAvailable(space);
  };

  const handleGetRecommendations = () => {
    if (location) {
      setResultsVisible(true);
    }
  };

  const toggleAutoML = () => {
    setShowAutoML(!showAutoML);
    if (showAutoML) {
      setResultsVisible(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="mb-6">
          <h1 className="mb-1 text-3xl font-bold">Find Your Tree</h1>
          <p className="text-lg text-gray-700">
            Get eco-friendly tree suggestions tailored to your space and city.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {showAutoML ? "AI-Powered Recommendations" : "Basic Recommendations"}
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleAutoML}
            className="text-xs"
          >
            {showAutoML ? "Show Basic Recommendations" : "Show Advanced AI"}
          </Button>
        </div>

        {!showAutoML ? (
          <>
            <LocationInput 
              onLocationSelect={handleLocationSelect} 
              initialLocation={location}
            />
            <SpaceAvailability onSpaceChange={handleSpaceChange} />

            <Button 
              onClick={handleGetRecommendations}
              disabled={!location}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Get Recommendations
            </Button>

            <div className="mt-8">
              <RecommendationResults 
                isVisible={resultsVisible} 
                location={location} 
              />

              <MiniMap 
                isVisible={resultsVisible} 
                location={location} 
              />

              <HowItWorks isVisible={resultsVisible} />
            </div>
          </>
        ) : (
          <div className="mb-6">
            <AutoMLPredictor />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Recommendations;
