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
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of today's gate activities."
      />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-4 md:p-5 text-primary-foreground animate-slide-up">
        <div className="relative z-10">
          <h2 className="text-lg md:text-xl font-bold mb-1">Welcome to RESL Gate Entry System</h2>
          <p className="text-primary-foreground/80 text-sm max-w-xl">
            Manage gate operations with seamless SAP integration.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-accent/20 to-transparent" />
        <Package className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 text-primary-foreground/10" />
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
