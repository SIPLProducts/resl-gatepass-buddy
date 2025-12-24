import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar, SidebarTrigger, SidebarCollapseTrigger } from './AppSidebar';
import { AppHeader } from './AppHeader';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleCollapse = () => setSidebarCollapsed(prev => !prev);

  return (
    <div className="flex min-h-screen bg-background w-full">
      <AppSidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        isCollapsed={sidebarCollapsed}
        onCollapse={toggleCollapse}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AppHeader 
          sidebarTrigger={<SidebarTrigger onClick={toggleSidebar} />}
          collapseTrigger={<SidebarCollapseTrigger isCollapsed={sidebarCollapsed} onClick={toggleCollapse} />}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
