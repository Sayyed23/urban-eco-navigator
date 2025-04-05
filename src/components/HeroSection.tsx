
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative h-[500px] sm:h-[600px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 bg-gray-900">
        <img 
          src="/lovable-uploads/f533de9e-d1ed-4f08-b675-a5bcf0b47799.png" 
          alt="Urban trees in city" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover the Best Trees for Your City
          </h1>
          <p className="text-xl text-gray-100 mb-8">
            Get personalized recommendations to improve your environment.
          </p>
          <Button 
            asChild
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
          >
            <Link to="/recommendations">
              Get Tree Suggestions
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
