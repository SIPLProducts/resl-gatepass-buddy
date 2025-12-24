import { useState } from 'react';
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
  LogOut,
  User,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  Shield,
  ChevronUp,
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
  path?: string;
  children?: { label: string; path: string; roles?: UserRole[] }[];
  roles?: UserRole[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// Define navigation with role-based access grouped
const navGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { 
        label: 'Dashboard', 
        icon: LayoutDashboard, 
        path: '/dashboard',
        roles: ['admin', 'security', 'stores', 'finance', 'viewer']
      },
    ],
  },
  {
    title: 'Gate Operations',
    items: [
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
      { label: 'Vehicle Exit', icon: DoorOpen, path: '/vehicle-exit', roles: ['admin', 'security'] },
    ],
  },
  {
    title: 'Entry Management',
    items: [
      { label: 'Change Entry', icon: FileEdit, path: '/change', roles: ['admin', 'stores'] },
      { label: 'Display Entry', icon: Eye, path: '/display', roles: ['admin', 'security', 'stores', 'finance', 'viewer'] },
      { label: 'Cancel Entry', icon: XCircle, path: '/cancel', roles: ['admin'] },
      { label: 'Print Entry', icon: Printer, path: '/print', roles: ['admin', 'security', 'stores', 'finance'] },
    ],
  },
  {
    title: 'Analytics & Config',
    items: [
      { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['admin', 'stores', 'finance', 'viewer'] },
      { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
      { label: 'Help & Support', icon: HelpCircle, path: '/help', roles: ['admin', 'security', 'stores', 'finance', 'viewer'] },
    ],
  },
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

  const hasAccess = (roles?: UserRole[]) => {
    if (!roles) return true;
    return roles.includes(currentRole);
  };

  const filterChildren = (children?: { label: string; path: string; roles?: UserRole[] }[]) => {
    if (!children) return [];
    return children.filter(child => hasAccess(child.roles));
  };

  const getVisibleGroups = () => {
    return navGroups.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (!hasAccess(item.roles)) return false;
        if (item.children) {
          const visibleChildren = filterChildren(item.children);
          return visibleChildren.length > 0;
        }
        return true;
      }),
    })).filter(group => group.items.length > 0);
  };

  const visibleGroups = getVisibleGroups();

  const renderNavItem = (item: NavItem) => {
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
            className={`sidebar-nav-item w-full justify-between group ${active ? 'text-sidebar-primary bg-sidebar-accent/50' : ''}`}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
            <div className="ml-4 pl-3 border-l border-sidebar-border/50 space-y-0.5 py-1">
              {visibleChildren.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                  className={({ isActive }) =>
                    `sidebar-nav-item text-[13px] py-1.5 ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                  {child.label}
                </NavLink>
              ))}
            </div>
          </div>
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
              <Icon className="w-4 h-4" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-sidebar-foreground/60 mt-1">
              {visibleChildren.map(c => c.label).join(', ')}
            </div>
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
              <Icon className="w-4 h-4" />
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
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.label}</span>
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
            ${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-sidebar flex flex-col border-r border-sidebar-border
            transform transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Section */}
          <div className={`h-16 border-b border-sidebar-border flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sidebar-primary/20">
                    <span className="text-sidebar-primary-foreground font-bold text-base">R</span>
                  </div>
                  <div>
                    <h1 className="text-sidebar-foreground font-bold text-sm tracking-wide">RESL GATE</h1>
                    <p className="text-sidebar-foreground/50 text-[10px] font-medium">Entry Management</p>
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
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
                <span className="text-sidebar-primary-foreground font-bold text-base">R</span>
              </div>
            )}
          </div>

          {/* Role Switcher (Development Mode) */}
          {!isCollapsed && (
            <div className="px-3 py-3 border-b border-sidebar-border/50">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors group">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sidebar-primary" />
                      <div className="text-left">
                        <p className="text-[11px] text-sidebar-foreground/50 font-medium">TESTING AS</p>
                        <p className="text-xs font-semibold text-sidebar-foreground">{roleConfig[currentRole].label}</p>
                      </div>
                    </div>
                    <ChevronUp className="w-4 h-4 text-sidebar-foreground/50 group-hover:text-sidebar-foreground transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-sidebar border-sidebar-border">
                  <DropdownMenuLabel className="text-sidebar-foreground/70 text-xs">Switch Role (Dev Mode)</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-sidebar-border" />
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => onRoleChange(role)}
                      className={`cursor-pointer ${currentRole === role ? 'bg-sidebar-accent' : ''} text-sidebar-foreground hover:bg-sidebar-accent focus:bg-sidebar-accent`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{roleConfig[role].label}</span>
                          {currentRole === role && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-sidebar-primary text-sidebar-primary">
                              Active
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-sidebar-foreground/50">{roleConfig[role].description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
            {visibleGroups.map((group, groupIndex) => (
              <div key={group.title} className={groupIndex > 0 ? 'mt-4' : ''}>
                {!isCollapsed && (
                  <div className="px-4 mb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40">
                      {group.title}
                    </h3>
                  </div>
                )}
                <div className={`space-y-0.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                  {group.items.map(renderNavItem)}
                </div>
              </div>
            ))}
          </nav>

          {/* Collapse Button */}
          <div className="px-3 py-2 border-t border-sidebar-border/50 hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className={`w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 h-8 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
            >
              {isCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 mr-2" />
                  <span className="text-xs">Collapse</span>
                </>
              )}
            </Button>
          </div>

          {/* User Section */}
          <div className={`border-t border-sidebar-border ${isCollapsed ? 'p-2' : 'p-3'}`}>
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sidebar-accent to-sidebar-accent/50 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-sidebar-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
                  <Badge variant="outline" className={`text-[10px] h-4 px-1.5 border ${roleConfig[currentRole].color}`}>
                    {roleConfig[currentRole].label}
                  </Badge>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                    Logout
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-full h-9 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                  Logout
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="px-4 py-2 border-t border-sidebar-border/50">
              <p className="text-[9px] text-sidebar-foreground/30 text-center font-medium">
                © Sharvi Infotech Pvt. Ltd. • v1.0.0
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
