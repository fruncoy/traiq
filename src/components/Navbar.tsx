import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium">
              Admin
            </Link>
            <Link to="/tasker" className="text-neutral-800 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium">
              Tasker
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;