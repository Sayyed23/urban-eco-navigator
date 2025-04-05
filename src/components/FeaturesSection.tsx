
import { CloudSun, MapPin, TreeDeciduous } from 'lucide-react';

const features = [
  {
    icon: <TreeDeciduous className="h-8 w-8 text-green-600" />,
    title: "Tree Recommendations",
    description: "Get personalized tree suggestions based on your location, climate, and available space. Our advanced algorithms analyze multiple factors to find the perfect match for your urban environment."
  },
  {
    icon: <CloudSun className="h-8 w-8 text-green-600" />,
    title: "Environmental Data Integration",
    description: "Access real-time environmental data including weather patterns, air quality metrics, and climate forecasts to make informed decisions about the best tree species for your area."
  },
  {
    icon: <MapPin className="h-8 w-8 text-green-600" />,
    title: "Health Tracking & Maintenance",
    description: "Monitor the health of your trees with our tracking system. Receive maintenance reminders, seasonal care tips, and alerts about potential issues to keep your trees thriving year-round."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How GreenGuide Works
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
