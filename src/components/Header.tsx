
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf, Award } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">GreenGuide</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/recommendations" className="text-gray-700 hover:text-green-600 transition-colors">
              Tree Recommendations
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-green-600 transition-colors">
              Profile
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
              Sustainability Dashboard
            </Link>
            <Link to="/eco-score" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors">
              <Award className="h-4 w-4" />
              <span>Eco-Score</span>
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-green-600 transition-colors">
              FAQ
            </Link>
            <Link to="/settings" className="text-gray-700 hover:text-green-600 transition-colors">
              Privacy & Settings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 hover:text-green-600"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-100">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link 
                  to="/recommendations" 
                  className="block text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tree Recommendations
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="block text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="block text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sustainability Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/eco-score" 
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Award className="h-4 w-4" />
                  <span>Eco-Score</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="block text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className="block text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Privacy & Settings
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
