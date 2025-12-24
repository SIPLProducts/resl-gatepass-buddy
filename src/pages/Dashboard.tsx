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

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';
  const userName = 'Admin User'; // This would come from auth context in real app

  return (
    <div className="space-y-8">
      {/* User Welcome Banner with Themed Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent/90 to-primary p-6 md:p-8 text-accent-foreground animate-slide-up shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-accent-foreground/70 text-sm font-medium uppercase tracking-wider mb-1">{greeting}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{userName}</h1>
            <p className="text-accent-foreground/80 text-sm md:text-base max-w-md">
              Ready to manage today's gate operations? Here's your activity overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-xs text-accent-foreground/60 uppercase tracking-wide">Today</span>
              <span className="text-lg font-semibold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center border-2 border-accent-foreground/20">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-accent-foreground" />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/30 blur-2xl" />
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-accent-foreground/10 blur-xl" />
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
