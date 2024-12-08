import { HeaderActions } from "./HeaderActions";

interface SidebarHeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
}

export const SidebarHeader = ({ isAdmin, onLogout }: SidebarHeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 hidden lg:flex items-center justify-between px-6">
      <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
      <HeaderActions onLogout={onLogout} />
    </header>
  );
};