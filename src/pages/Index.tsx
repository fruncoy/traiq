import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-neutral-900 sm:text-5xl md:text-6xl">
                <span className="block">Complete tasks and earn money</span>
                <span className="block text-primary-DEFAULT">
                  by training AI in local languages
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-neutral-800 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Your go-to platform for managing tasks, bidding, and efficient collaboration. 
                Connect with skilled professionals and get your projects done right.
              </p>
              <div className="mt-10 flex justify-center gap-x-6">
                <Link
                  to="/admin"
                  className="rounded-md bg-primary-DEFAULT px-8 py-3 text-base font-medium text-white hover:bg-primary-dark"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/tasker"
                  className="rounded-md bg-accent-DEFAULT px-8 py-3 text-base font-medium text-white hover:bg-accent-dark"
                >
                  Tasker Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;