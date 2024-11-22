import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin"
              className="text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </Link>
            <Link
              to="/tasker"
              className="text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium"
            >
              Tasker
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-800 hover:text-primary-DEFAULT focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/admin"
            className="block text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
          <Link
            to="/tasker"
            className="block text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Tasker
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;