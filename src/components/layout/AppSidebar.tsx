import { useState, createContext, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  User,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Role types
type UserRole = 'admin' | 'security' | 'stores' | 'finance' | 'viewer';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: { label: string; path: string; roles?: UserRole[] }[];
  roles?: UserRole[]; // Which roles can see this item
}

// Define navigation with role-based access
const navItems: NavItem[] = [
  { 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/dashboard',
    roles: ['admin', 'security', 'stores', 'finance', 'viewer']
  },
  {
    label: 'Inward',
    icon: ArrowDownToLine,
    roles: ['admin', 'security', 'stores'],
    children: [
      { label: 'With PO Reference', path: '/inward/po-reference', roles: ['admin', 'security', 'stores'] },
      { label: 'Subcontracting', path: '/inward/subcontracting', roles: ['admin', 'stores'] },
      { label: 'Without Reference', path: '/inward/without-reference', roles: ['admin', 'stores'] },
    ],
  },
  {
    label: 'Outward',
    icon: ArrowUpFromLine,
    roles: ['admin', 'security', 'stores'],
    children: [
      { label: 'Billing Reference', path: '/outward/billing-reference', roles: ['admin', 'security', 'stores'] },
      { label: 'Non-Returnable', path: '/outward/non-returnable', roles: ['admin', 'stores'] },
      { label: 'Returnable', path: '/outward/returnable', roles: ['admin', 'stores'] },
    ],
  },
  { label: 'Change', icon: FileEdit, path: '/change', roles: ['admin', 'stores'] },
  { label: 'Display', icon: Eye, path: '/display', roles: ['admin', 'security', 'stores', 'finance', 'viewer'] },
  { label: 'Vehicle Exit', icon: DoorOpen, path: '/vehicle-exit', roles: ['admin', 'security'] },
  { label: 'Cancel', icon: XCircle, path: '/cancel', roles: ['admin'] },
  { label: 'Print', icon: Printer, path: '/print', roles: ['admin', 'security', 'stores', 'finance'] },
  { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['admin', 'stores', 'finance', 'viewer'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
  { label: 'Help & Support', icon: HelpCircle, path: '/help', roles: ['admin', 'security', 'stores', 'finance', 'viewer'] },
];

// Mock current user - in real app this would come from auth context
const currentUser = {
  name: 'Admin User',
  email: 'admin@resl.com',
  role: 'admin' as UserRole,
};

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

export function AppSidebar({ isOpen, onToggle, isCollapsed, onCollapse }: AppSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Inward', 'Outward']);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActive = (path?: string, children?: { path: string }[]) => {
    if (path) return location.pathname === path;
    if (children) return children.some((child) => location.pathname === child.path);
    return false;
  };

  // Filter items based on user role
  const hasAccess = (roles?: UserRole[]) => {
    if (!roles) return true;
    return roles.includes(currentUser.role);
  };

  const filterChildren = (children?: { label: string; path: string; roles?: UserRole[] }[]) => {
    if (!children) return [];
    return children.filter(child => hasAccess(child.roles));
  };

  const visibleNavItems = navItems.filter(item => {
    if (!hasAccess(item.roles)) return false;
    if (item.children) {
      const visibleChildren = filterChildren(item.children);
      return visibleChildren.length > 0;
    }
    return true;
  });

  return (
    <TooltipProvider delayDuration={0}>
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={onToggle}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:sticky inset-y-0 left-0 top-0 z-50
            ${isCollapsed ? 'w-[70px]' : 'w-64'} h-screen bg-sidebar flex flex-col border-r border-sidebar-border
            transform transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Section */}
          <div className={`p-4 border-b border-sidebar-border flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sidebar-primary-foreground font-bold text-lg">R</span>
                  </div>
                  <div>
                    <h1 className="text-sidebar-foreground font-bold text-base">RESL</h1>
                    <p className="text-sidebar-foreground/60 text-[10px]">Gate Entry System</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
                  onClick={onToggle}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-lg">R</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto scrollbar-thin">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.children;
              const isExpanded = expandedItems.includes(item.label);
              const active = isActive(item.path, item.children);
              const visibleChildren = filterChildren(item.children);

              if (hasChildren && !isCollapsed) {
                return (
                  <div key={item.label} className="space-y-0.5">
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={`sidebar-nav-item w-full justify-between ${active ? 'text-sidebar-primary' : ''}`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                        <span className="text-[13px]">{item.label}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-5 pl-3 border-l border-sidebar-border space-y-0.5 animate-fade-in">
                        {visibleChildren.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => window.innerWidth < 1024 && onToggle()}
                            className={({ isActive }) =>
                              `sidebar-nav-item text-[12px] py-2 ${isActive ? 'active' : ''}`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (hasChildren && isCollapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={visibleChildren[0]?.path || '#'}
                        className={`sidebar-nav-item justify-center ${active ? 'active' : ''}`}
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

              if (isCollapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.path!}
                        onClick={() => window.innerWidth < 1024 && onToggle()}
                        className={({ isActive }) => `sidebar-nav-item justify-center ${isActive ? 'active' : ''}`}
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
                  key={item.label}
                  to={item.path!}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                  className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="text-[13px]">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <div className="px-2 py-2 border-t border-sidebar-border hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className={`w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
            >
              {isCollapsed ? (
                <PanelLeft className="w-[18px] h-[18px]" />
              ) : (
                <>
                  <PanelLeftClose className="w-[18px] h-[18px] mr-2" />
                  <span className="text-[12px]">Collapse</span>
                </>
              )}
            </Button>
          </div>

          {/* User Section */}
          <div className={`p-3 border-t border-sidebar-border ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-sidebar-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-sidebar-foreground/60 truncate capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <button className="sidebar-nav-item w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10 py-2">
                  <LogOut className="w-4 h-4" />
                  <span className="text-[12px]">Logout</span>
                </button>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="sidebar-nav-item w-full justify-center text-destructive/80 hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                  Logout
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="px-3 py-2 border-t border-sidebar-border">
              <p className="text-[9px] text-sidebar-foreground/50 text-center">
                © Sharvi Infotech Pvt. Ltd. | v1.0.0
              </p>
            </div>
          )}
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
  return (
    <Button 
      variant="ghost" 
      size="icon"
      className="hidden lg:flex"
      onClick={onClick}
    >
      {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
    </Button>
  );
}
