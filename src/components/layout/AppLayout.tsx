import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar, SidebarTrigger } from './AppSidebar';
import { AppHeader } from './AppHeader';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="flex min-h-screen bg-background w-full">
      <AppSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader sidebarTrigger={<SidebarTrigger onClick={toggleSidebar} />} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
