
import { CircleHelp, Database, MapPin, TreePine } from "lucide-react";

type HowItWorksProps = {
  isVisible: boolean;
};

const HowItWorks = ({ isVisible }: HowItWorksProps) => {
  if (!isVisible) {
    return null;
  }

  const steps = [
    {
      icon: <MapPin className="h-8 w-8 text-eco-green" />,
      title: "Location Analysis",
      description: "Your location data and climate conditions are analyzed.",
    },
    {
      icon: <Database className="h-8 w-8 text-eco-green" />,
      title: "Tree Database",
      description: "We match your space with our extensive tree database.",
    },
    {
      icon: <TreePine className="h-8 w-8 text-eco-green" />,
      title: "Recommendations",
      description: "Get personalized tree suggestions optimized for your environment.",
    },
  ];

  return (
    <div className="mt-12 animate-fade-in rounded-lg bg-eco-sand/50 p-6">
      <div className="mb-4 flex items-center">
        <CircleHelp className="mr-2 h-5 w-5 text-eco-green" />
        <h2 className="text-xl font-bold">How It Works</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
            <div className="mb-3 rounded-full bg-eco-light-green/20 p-3">
              {step.icon}
            </div>
            <h3 className="mb-2 font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
