import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  FileEdit,
  Eye,
  DoorOpen,
  XCircle,
  Printer,
  BarChart3,
  TrendingUp,
  Clock,
  Package,
  Truck,
  Palette,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ModuleCard } from '@/components/shared/ModuleCard';
import { StatCard } from '@/components/shared/StatCard';

const stats = [
  { title: "Today's Inward", value: 24, icon: ArrowDownToLine, trend: { value: 12, isPositive: true }, color: 'accent' as const },
  { title: "Today's Outward", value: 18, icon: ArrowUpFromLine, trend: { value: 8, isPositive: true }, color: 'info' as const },
  { title: 'Pending Exit', value: 7, icon: Clock, color: 'warning' as const },
  { title: 'Total Vehicles', value: 156, icon: Truck, trend: { value: 5, isPositive: true }, color: 'primary' as const },
];

const modules = [
  {
    title: 'Inward Gate Entry',
    description: 'Record incoming materials with PO reference or manual entry',
    icon: ArrowDownToLine,
    path: '/inward/po-reference',
    color: 'accent' as const,
  },
  {
    title: 'Outward Gate Entry',
    description: 'Track outgoing materials with billing reference',
    icon: ArrowUpFromLine,
    path: '/outward/billing-reference',
    color: 'info' as const,
  },
  {
    title: 'Change Entry',
    description: 'Modify existing gate entry records',
    icon: FileEdit,
    path: '/change',
    color: 'primary' as const,
  },
  {
    title: 'Display Entry',
    description: 'View detailed gate entry information',
    icon: Eye,
    path: '/display',
    color: 'success' as const,
  },
  {
    title: 'Vehicle Exit',
    description: 'Record vehicle departure time and details',
    icon: DoorOpen,
    path: '/vehicle-exit',
    color: 'warning' as const,
  },
  {
    title: 'Cancel Entry',
    description: 'Cancel gate entries with proper authorization',
    icon: XCircle,
    path: '/cancel',
    color: 'warning' as const,
  },
  {
    title: 'Print Entry',
    description: 'Generate and print gate entry documents',
    icon: Printer,
    path: '/print',
    color: 'primary' as const,
  },
  {
    title: 'Reports',
    description: 'Generate comprehensive gate entry reports',
    icon: BarChart3,
    path: '/reports',
    color: 'info' as const,
  },
];

const recentEntries = [
  { id: 'GE-2024-001', type: 'Inward', vendor: 'ABC Suppliers', vehicle: 'MH-12-AB-1234', time: '10:30 AM', status: 'Active' },
  { id: 'GE-2024-002', type: 'Outward', vendor: 'XYZ Trading', vehicle: 'MH-14-CD-5678', time: '11:15 AM', status: 'Exited' },
  { id: 'GE-2024-003', type: 'Inward', vendor: 'PQR Industries', vehicle: 'MH-04-EF-9012', time: '12:00 PM', status: 'Active' },
  { id: 'GE-2024-004', type: 'Inward', vendor: 'LMN Enterprises', vehicle: 'MH-20-GH-3456', time: '01:45 PM', status: 'Active' },
];

const welcomeThemes = [
  { name: 'Teal', gradient: 'from-accent via-accent/90 to-primary' },
  { name: 'Blue', gradient: 'from-blue-600 via-blue-500 to-indigo-600' },
  { name: 'Purple', gradient: 'from-purple-600 via-purple-500 to-pink-500' },
  { name: 'Green', gradient: 'from-emerald-600 via-emerald-500 to-teal-500' },
  { name: 'Orange', gradient: 'from-orange-500 via-orange-400 to-amber-500' },
  { name: 'Red', gradient: 'from-rose-600 via-rose-500 to-pink-500' },
];

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';
  const userName = 'Admin User';
  
  const [themeIndex, setThemeIndex] = useState(0);
  const currentTheme = welcomeThemes[themeIndex];

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % welcomeThemes.length);
  };

  return (
    <div className="space-y-8">
      {/* User Welcome Banner with Themed Gradient */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${currentTheme.gradient} py-10 px-8 text-white animate-slide-up shadow-xl max-w-md`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-2">{greeting}</p>
          <h1 className="text-3xl font-bold mb-3">{userName}</h1>
          <p className="text-white/70 text-sm">
            Ready to manage today's gate operations.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <button 
              onClick={cycleTheme}
              className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
              title="Change theme color"
            >
              <Palette className="w-3 h-3" />
              {currentTheme.name}
            </button>
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
          <Package className="w-8 h-8 text-white/80" />
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ animationDelay: '0.1s' }}>
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, index) => (
            <div key={module.title} className="animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
              <ModuleCard {...module} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Gate Entries</h3>
        <div className="enterprise-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Entry No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Vehicle No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry) => (
                <tr key={entry.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-accent">{entry.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge-status ${entry.type === 'Inward' ? 'bg-accent/10 text-accent' : 'bg-info/10 text-info'}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{entry.vendor}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{entry.vehicle}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{entry.time}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge-status ${entry.status === 'Active' ? 'badge-success' : 'badge-info'}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
