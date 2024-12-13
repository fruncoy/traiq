import React from "react";
import { PageTitle } from "./PageTitle";
import { HeaderActions } from "./HeaderActions";

interface MainHeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
}

export const MainHeader = ({ isAdmin, onLogout }: MainHeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
      <PageTitle />
      <HeaderActions onLogout={onLogout} isAdmin={isAdmin} />
    </header>
  );
};