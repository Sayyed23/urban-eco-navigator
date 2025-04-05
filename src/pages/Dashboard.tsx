
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BarChart3, Award } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sustainability Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 mb-4">
                Track and visualize your environmental impact based on the trees you've planted.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Full functionality coming soon.
              </p>
              <div className="flex justify-center">
                <BarChart3 className="w-32 h-32 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                <span>Eco-Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 mb-4">
                View your city's environmental score and complete eco challenges to improve it!
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Compete with other cities and earn points for sustainable actions.
              </p>
              <Button asChild>
                <Link to="/eco-score">View Eco-Score</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-lg text-gray-700">
          More dashboard features will be available soon.
        </p>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
