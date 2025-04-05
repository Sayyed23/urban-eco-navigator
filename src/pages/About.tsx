
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About GreenGuide</h1>
        <p className="text-lg text-gray-700 mb-4">
          GreenGuide was founded with a simple mission: to make cities greener by helping people plant the right trees in the right places.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our team of environmental scientists, urban planners, and technology experts came together to create a solution that bridges
          the gap between environmental science and everyday urban dwellers who want to make a positive impact.
        </p>
        <p className="text-lg text-gray-700">
          By combining cutting-edge data analytics with practical tree-planting knowledge, GreenGuide offers personalized recommendations
          that consider your specific location, climate conditions, and space constraints.
        </p>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
