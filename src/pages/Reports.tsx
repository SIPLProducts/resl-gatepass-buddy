import { Search, FileSpreadsheet, Download } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const mockData = [
  { id: 'GE-2024-001', type: 'Inward', plant: '1000', vendor: 'ABC Suppliers', vehicle: 'MH-12-AB-1234', date: '2024-01-15', status: 'Active' },
  { id: 'GE-2024-002', type: 'Outward', plant: '1000', vendor: 'XYZ Trading', vehicle: 'MH-14-CD-5678', date: '2024-01-15', status: 'Exited' },
  { id: 'GE-2024-003', type: 'Inward', plant: '2000', vendor: 'PQR Industries', vehicle: 'MH-04-EF-9012', date: '2024-01-14', status: 'Active' },
];

export default function Reports() {
  const [filters, setFilters] = useState({ plant: '', type: '', fromDate: '', toDate: '' });
  const [results, setResults] = useState(mockData);

  const handleSearch = () => { toast.success('Report generated'); setResults(mockData); };
  const handleExport = () => { toast.success('Exporting to Excel...'); };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Generate and export gate entry reports" breadcrumbs={[{ label: 'Reports' }]} />
      <FormSection title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SelectField label="Plant" value={filters.plant} onChange={(v) => setFilters({...filters, plant: v})} options={[{value:'1000',label:'1000'},{value:'2000',label:'2000'}]} />
          <SelectField label="Entry Type" value={filters.type} onChange={(v) => setFilters({...filters, type: v})} options={[{value:'inward',label:'Inward'},{value:'outward',label:'Outward'}]} />
          <TextField label="From Date" type="date" value={filters.fromDate} onChange={(v) => setFilters({...filters, fromDate: v})} />
          <TextField label="To Date" type="date" value={filters.toDate} onChange={(v) => setFilters({...filters, toDate: v})} />
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} className="gap-2 flex-1"><Search className="w-4 h-4" />Search</Button>
            <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="w-4 h-4" /></Button>
          </div>
        </div>
      </FormSection>
      <FormSection title="Results">
        <div className="data-grid">
          <table className="w-full">
            <thead><tr><th>Entry No</th><th>Type</th><th>Plant</th><th>Vendor</th><th>Vehicle</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-muted/50 cursor-pointer">
                  <td className="text-accent font-medium">{r.id}</td><td>{r.type}</td><td>{r.plant}</td><td>{r.vendor}</td><td>{r.vehicle}</td><td>{r.date}</td>
                  <td><span className={`badge-status ${r.status === 'Active' ? 'badge-success' : 'badge-info'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>
    </div>
  );
}
