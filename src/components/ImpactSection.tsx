
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const ImpactSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="bg-green-50 p-6 rounded-lg flex justify-center items-center">
              <BarChart3 className="w-full h-64 text-green-600" />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Track Your Environmental Impact
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Every tree you plant contributes to cleaner air, biodiversity, and a more sustainable future. 
              With GreenGuide's impact dashboard, you can visualize the positive changes your tree planting 
              efforts are making to your local environment.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Our dashboard tracks metrics like carbon dioxide absorption, oxygen production, 
              and potential energy savings from strategic tree placement. Watch your environmental 
              contribution grow over time!
            </p>
            <Button 
              asChild
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link to="/dashboard">
                See Your Impact
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
