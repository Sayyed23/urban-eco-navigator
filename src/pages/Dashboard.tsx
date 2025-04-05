
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sustainability Dashboard</h1>
        <p className="text-lg text-gray-700 mb-4">
          This dashboard will track and visualize your environmental impact based on the trees you've planted.
        </p>
        <p className="text-lg text-gray-700">
          Please check back soon for the full functionality.
        </p>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
