
import { Leaf } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What is GreenGuide?
          </h2>
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            GreenGuide is a revolutionary app designed to connect urban dwellers with the perfect tree species for their environment. 
            Our mission is to improve urban spaces by recommending climate-appropriate trees that enhance air quality, provide shade, 
            and boost overall well-being in cities.
          </p>
          <p className="text-lg text-gray-700">
            Using advanced algorithms and environmental data, we analyze various factors including local climate conditions, 
            space constraints, and environmental goals to suggest the most suitable tree species for your specific urban location.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
