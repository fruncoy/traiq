import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin" className="text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium">
              Admin
            </Link>
            <Link to="/tasker" className="text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium">
              Tasker
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-800 hover:text-primary-DEFAULT focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/admin" 
                className="block text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <Link 
                to="/tasker" 
                className="block text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tasker
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;