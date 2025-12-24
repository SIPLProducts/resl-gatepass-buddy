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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  {
    label: 'Inward',
    icon: ArrowDownToLine,
    children: [
      { label: 'With PO Reference', path: '/inward/po-reference' },
      { label: 'Subcontracting', path: '/inward/subcontracting' },
      { label: 'Without Reference', path: '/inward/without-reference' },
    ],
  },
  {
    label: 'Outward',
    icon: ArrowUpFromLine,
    children: [
      { label: 'Billing Reference', path: '/outward/billing-reference' },
      { label: 'Non-Returnable', path: '/outward/non-returnable' },
      { label: 'Returnable', path: '/outward/returnable' },
    ],
  },
  { label: 'Change', icon: FileEdit, path: '/change' },
  { label: 'Display', icon: Eye, path: '/display' },
  { label: 'Vehicle Exit', icon: DoorOpen, path: '/vehicle-exit' },
  { label: 'Cancel', icon: XCircle, path: '/cancel' },
  { label: 'Print', icon: Printer, path: '/print' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Help & Support', icon: HelpCircle, path: '/help' },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
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

  return (
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
          w-64 h-screen bg-sidebar flex flex-col border-r border-sidebar-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-bold text-lg">RESL</h1>
              <p className="text-sidebar-foreground/60 text-xs">Gate Entry System</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onToggle}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;
            const isExpanded = expandedItems.includes(item.label);
            const active = isActive(item.path, item.children);

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={`sidebar-nav-item w-full justify-between ${active ? 'text-sidebar-primary' : ''}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 pl-4 border-l border-sidebar-border space-y-1 animate-fade-in">
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => window.innerWidth < 1024 && onToggle()}
                          className={({ isActive }) =>
                            `sidebar-nav-item text-sm ${isActive ? 'active' : ''}`
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

            return (
              <NavLink
                key={item.label}
                to={item.path!}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="w-4 h-4 text-sidebar-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">admin@resl.com</p>
            </div>
          </div>
          <button className="sidebar-nav-item w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-[10px] text-sidebar-foreground/50 text-center">
            © Sharvi Infotech Pvt. Ltd.
          </p>
          <p className="text-[10px] text-sidebar-foreground/40 text-center">v1.0.0</p>
        </div>
      </aside>
    </>
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
