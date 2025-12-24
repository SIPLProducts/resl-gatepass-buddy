import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileEdit,
  Eye,
  DoorOpen,
  XCircle,
  Printer,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  Bell,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

// Role types
export type UserRole = 'admin' | 'security' | 'stores' | 'finance' | 'viewer';

const roleConfig: Record<UserRole, { label: string; color: string; description: string }> = {
  admin: { label: 'Administrator', color: 'bg-red-500/20 text-red-400 border-red-500/30', description: 'Full access to all modules' },
  security: { label: 'Security', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', description: 'Gate entry & exit access' },
  stores: { label: 'Stores', color: 'bg-green-500/20 text-green-400 border-green-500/30', description: 'Inward/Outward management' },
  finance: { label: 'Finance', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', description: 'Reports & billing access' },
  viewer: { label: 'Viewer', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', description: 'View only access' },
};

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: UserRole[];
}

// Define flat navigation with role-based access
const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'security', 'stores', 'finance', 'viewer'] },
  { label: 'Inward Entry', icon: ArrowDownToLine, path: '/inward/po-reference', roles: ['admin', 'security', 'stores'] },
  { label: 'Outward Entry', icon: ArrowUpFromLine, path: '/outward/billing-reference', roles: ['admin', 'security', 'stores'] },
  { label: 'Vehicle Exit', icon: DoorOpen, path: '/vehicle-exit', roles: ['admin', 'security'] },
  { label: 'Change Entry', icon: FileEdit, path: '/change', roles: ['admin', 'stores'] },
  { label: 'Display Entry', icon: Eye, path: '/display', roles: ['admin', 'security', 'stores', 'finance', 'viewer'] },
  { label: 'Cancel Entry', icon: XCircle, path: '/cancel', roles: ['admin'] },
  { label: 'Print Entry', icon: Printer, path: '/print', roles: ['admin', 'security', 'stores', 'finance'] },
  { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['admin', 'stores', 'finance', 'viewer'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
];

const bottomNavItems: NavItem[] = [
  { label: 'Help & Support', icon: HelpCircle, path: '/help', roles: ['admin', 'security', 'stores', 'finance', 'viewer'] },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function AppSidebar({ isOpen, onToggle, isCollapsed, onCollapse, currentRole, onRoleChange }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const hasAccess = (roles: UserRole[]) => roles.includes(currentRole);

  const visibleMainItems = mainNavItems.filter(item => hasAccess(item.roles));
  const visibleBottomItems = bottomNavItems.filter(item => hasAccess(item.roles));

  const handleLogout = () => {
    // In a real app, this would call supabase.auth.signOut()
    navigate('/');
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    
    if (isCollapsed) {
      return (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>
            <NavLink
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onToggle()}
              className={({ isActive }) => 
                `flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 mx-auto
                ${isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => window.innerWidth < 1024 && onToggle()}
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30'
          }`
        }
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span className="text-sm font-medium">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={onToggle}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:sticky inset-y-0 left-0 top-0 z-50
            ${isCollapsed ? 'w-[72px]' : 'w-[260px]'} h-screen bg-sidebar flex flex-col
            transform transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Section */}
          <div className={`h-14 flex items-center flex-shrink-0 ${isCollapsed ? 'justify-center px-3' : 'justify-between px-5'}`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sidebar-primary-foreground font-bold text-base">R</span>
                  </div>
                  <div>
                    <h1 className="text-sidebar-foreground font-bold text-sm">RESL Gate</h1>
                    <p className="text-sidebar-foreground/40 text-[10px]">Entry System</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hidden lg:flex text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-7 w-7"
                    onClick={onCollapse}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
                    onClick={onToggle}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground font-bold text-base">R</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden lg:flex text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-7 w-7"
                  onClick={onCollapse}
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          {!isCollapsed && (
            <div className="px-4 pb-3 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/40 hover:bg-sidebar-accent/60 transition-colors border border-sidebar-border/30">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-sidebar-primary" />
                      <span className="text-xs font-medium text-sidebar-foreground">{roleConfig[currentRole].label}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 bg-sidebar border-sidebar-border">
                  <DropdownMenuLabel className="text-sidebar-foreground/60 text-xs">Switch Role</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-sidebar-border" />
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => onRoleChange(role)}
                      className={`cursor-pointer ${currentRole === role ? 'bg-sidebar-accent' : ''} text-sidebar-foreground hover:bg-sidebar-accent focus:bg-sidebar-accent`}
                    >
                      <span className="text-sm">{roleConfig[role].label}</span>
                      {currentRole === role && (
                        <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1.5 border-sidebar-primary text-sidebar-primary">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Main Navigation */}
          <nav className={`flex-1 overflow-y-auto scrollbar-thin py-2 ${isCollapsed ? 'px-3' : 'px-4'}`}>
            <div className="space-y-0.5">
              {visibleMainItems.map(renderNavItem)}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className={`border-t border-sidebar-border/30 flex-shrink-0 ${isCollapsed ? 'px-3 py-2' : 'px-4 py-3'}`}>
            <div className="space-y-0.5">
              {visibleBottomItems.map(renderNavItem)}
              
              {/* Notifications */}
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center w-9 h-9 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all mx-auto">
                      <Bell className="w-[18px] h-[18px]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                    Notifications
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 transition-all w-full">
                  <Bell className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="text-sm font-medium">Notifications</span>
                </button>
              )}

              {/* Logout */}
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all mx-auto"
                    >
                      <LogOut className="w-[18px] h-[18px]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                    Logout
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
                >
                  <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </aside>
      </>
    </TooltipProvider>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}

export function SidebarCollapseTrigger({ isCollapsed, onClick }: { isCollapsed: boolean; onClick: () => void }) {
  return null; // Hidden for cleaner design
}
