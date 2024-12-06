import React from 'react';
import { SidebarContainer } from './sidebar/SidebarContainer';
import { MainContent } from './sidebar/MainContent';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNav } from './sidebar/SidebarNav';
import { PageTitle } from './sidebar/PageTitle';

interface SidebarProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  fixed?: boolean;
}

const Sidebar = ({ children, isAdmin = false, fixed = false }: SidebarProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarContainer fixed={fixed}>
        <SidebarHeader isAdmin={isAdmin} />
        <SidebarNav isAdmin={isAdmin} />
      </SidebarContainer>
      <MainContent hasSidebar>
        <PageTitle />
        {children}
      </MainContent>
    </div>
  );
};

export default Sidebar;