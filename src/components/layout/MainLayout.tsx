import React, { useState } from "react";
import { Sidebar } from "../sidebar/Sidebar";

interface MainLayoutProps {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

export const MainLayout = ({ isAdmin = false, children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        isAdmin={isAdmin} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};