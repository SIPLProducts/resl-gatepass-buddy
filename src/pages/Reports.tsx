import { Search, Download, FileSpreadsheet, Package, Truck, Clock, XCircle, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StatCard } from '@/components/shared/StatCard';
import { exportToExcel } from '@/lib/exportToExcel';

// Mock data based on Excel structure
const mockData = [
  { gateEntryNo: 'A624A00001', plant: '3601', type: 'IN', vehicleDate: '2024-01-03', vehicleTime: '12:06 AM', vehicleOutDate: '', vehicleNo: '123456788', driverName: 'RAJ', transporterName: 'RAJ', refDocType: 'PO', poNo: '100109798', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '5000024', vendorName: 'Ramky Enviro Engineers Limited', quantity: 80, unit: 'SET', vehicleExit: false, cancelled: true, salesOrg: '3600', invoiceNo: '' },
  { gateEntryNo: 'A624A00002', plant: '3601', type: 'IN', vehicleDate: '2024-01-03', vehicleTime: '12:36 AM', vehicleOutDate: '', vehicleNo: '123456788', driverName: 'RAJ', transporterName: 'RAJ', refDocType: 'PO', poNo: '100109798', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '5000024', vendorName: 'Ramky Enviro Engineers Limited', quantity: 80, unit: 'SET', vehicleExit: false, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-001' },
  { gateEntryNo: 'A624A00003', plant: '3601', type: 'IN', vehicleDate: '2024-01-03', vehicleTime: '11:43 AM', vehicleOutDate: '', vehicleNo: 'AP37AZ1235', driverName: 'TEST', transporterName: 'VYSHNAVI', refDocType: 'PO', poNo: '100109799', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '5000024', vendorName: 'Ramky Enviro Engineers Limited', quantity: 800, unit: 'SET', vehicleExit: false, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-002' },
  { gateEntryNo: 'A624B00001', plant: '3601', type: 'OUT', vehicleDate: '2024-02-01', vehicleTime: '10:00 AM', vehicleOutDate: '2024-02-01', vehicleNo: 'TS07DE3456', driverName: 'SURESH', transporterName: 'VYSHNAVI', refDocType: 'SO', poNo: '', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '1001706', vendorName: 'Tata Motors Ltd.', quantity: 50, unit: 'SET', vehicleExit: true, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-003' },
  { gateEntryNo: 'A624B00002', plant: '3601', type: 'OUT', vehicleDate: '2024-02-02', vehicleTime: '02:30 PM', vehicleOutDate: '2024-02-02', vehicleNo: 'MH12AB1234', driverName: 'MOHAN', transporterName: 'BLUE DART', refDocType: 'SO', poNo: '', materialCode: '300045678', materialDesc: 'Spare Parts Kit', vendorNo: '1001707', vendorName: 'Mahindra Ltd.', quantity: 25, unit: 'NOS', vehicleExit: true, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-004' },
  { gateEntryNo: 'A624C00001', plant: '3602', type: 'IN', vehicleDate: '2024-03-15', vehicleTime: '09:15 AM', vehicleOutDate: '2024-03-15', vehicleNo: 'KA01MN5678', driverName: 'RAVI', transporterName: 'GATI', refDocType: 'SUB', poNo: '100110001', materialCode: '400012345', materialDesc: 'Sub Assembly Part', vendorNo: '5000025', vendorName: 'Bharat Forge', quantity: 100, unit: 'KG', vehicleExit: true, cancelled: false, salesOrg: '3601', invoiceNo: 'INV-005' },
];

interface FilterState {
  gateEntryNoFrom: string;
  gateEntryNoTo: string;
  entryDateFrom: string;
  entryDateTo: string;
  plant: string;
  plantTo: string;
  vehicleNo: string;
  invoiceNoFrom: string;
  invoiceNoTo: string;
  salesOrgFrom: string;
  salesOrgTo: string;
  processType: 'inward' | 'outward' | 'both';
}

export default function Reports() {
  const [filters, setFilters] = useState<FilterState>({
    gateEntryNoFrom: '',
    gateEntryNoTo: '',
    entryDateFrom: '',
    entryDateTo: '',
    plant: '',
    plantTo: '',
    vehicleNo: '',
    invoiceNoFrom: '',
    invoiceNoTo: '',
    salesOrgFrom: '',
    salesOrgTo: '',
    processType: 'both',
  });
  const [results, setResults] = useState(mockData);
  const [showResults, setShowResults] = useState(false);

  // Calculate KPIs
  const kpis = {
    totalEntries: results.length,
    inwardEntries: results.filter(r => r.type === 'IN').length,
    outwardEntries: results.filter(r => r.type === 'OUT').length,
    vehiclesExited: results.filter(r => r.vehicleExit).length,
    vehiclesPending: results.filter(r => !r.vehicleExit && !r.cancelled).length,
    cancelledEntries: results.filter(r => r.cancelled).length,
  };

  const handleSearch = () => {
    let filtered = [...mockData];

    // Filter by process type
    if (filters.processType === 'inward') {
      filtered = filtered.filter(r => r.type === 'IN');
    } else if (filters.processType === 'outward') {
      filtered = filtered.filter(r => r.type === 'OUT');
    }

    // Filter by plant
    if (filters.plant) {
      filtered = filtered.filter(r => r.plant >= filters.plant && (!filters.plantTo || r.plant <= filters.plantTo));
    }

    // Filter by vehicle no
    if (filters.vehicleNo) {
      filtered = filtered.filter(r => r.vehicleNo.toLowerCase().includes(filters.vehicleNo.toLowerCase()));
    }

    // Filter by date range
    if (filters.entryDateFrom) {
      filtered = filtered.filter(r => r.vehicleDate >= filters.entryDateFrom);
    }
    if (filters.entryDateTo) {
      filtered = filtered.filter(r => r.vehicleDate <= filters.entryDateTo);
    }

    setResults(filtered);
    setShowResults(true);
    toast.success(`Found ${filtered.length} entries`);
  };

  const handleExport = () => {
    const columns = [
      { key: 'gateEntryNo', header: 'Gate Entry No' },
      { key: 'plant', header: 'Plant' },
      { key: 'type', header: 'Type' },
      { key: 'vehicleDate', header: 'Vehicle Date' },
      { key: 'vehicleTime', header: 'Vehicle Time' },
      { key: 'vehicleOutDate', header: 'Vehicle Out Date' },
      { key: 'vehicleNo', header: 'Vehicle No' },
      { key: 'driverName', header: 'Driver Name' },
      { key: 'transporterName', header: 'Transporter' },
      { key: 'refDocType', header: 'Ref Doc Type' },
      { key: 'poNo', header: 'PO No' },
      { key: 'materialCode', header: 'Material Code' },
      { key: 'materialDesc', header: 'Material Description' },
      { key: 'vendorNo', header: 'Vendor No' },
      { key: 'vendorName', header: 'Vendor Name' },
      { key: 'quantity', header: 'Quantity' },
      { key: 'unit', header: 'Unit' },
      { key: 'salesOrg', header: 'Sales Org' },
      { key: 'invoiceNo', header: 'Invoice No' },
    ];
    exportToExcel(results, columns, 'Gate_Entry_Report');
    toast.success('Exporting to Excel...');
  };

  const handleReset = () => {
    setFilters({
      gateEntryNoFrom: '',
      gateEntryNoTo: '',
      entryDateFrom: '',
      entryDateTo: '',
      plant: '',
      plantTo: '',
      vehicleNo: '',
      invoiceNoFrom: '',
      invoiceNoTo: '',
      salesOrgFrom: '',
      salesOrgTo: '',
      processType: 'both',
    });
    setResults(mockData);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gate Entry Report" 
        subtitle="Generate and export gate entry reports with advanced filters" 
        breadcrumbs={[{ label: 'Reports' }]} 
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard 
          title="Total Entries" 
          value={kpis.totalEntries} 
          icon={FileSpreadsheet} 
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard 
          title="Inward" 
          value={kpis.inwardEntries} 
          icon={Package} 
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard 
          title="Outward" 
          value={kpis.outwardEntries} 
          icon={Truck} 
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard 
          title="Exited" 
          value={kpis.vehiclesExited} 
          icon={CheckCircle} 
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard 
          title="Pending Exit" 
          value={kpis.vehiclesPending} 
          icon={Clock} 
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard 
          title="Cancelled" 
          value={kpis.cancelledEntries} 
          icon={XCircle} 
          trend={{ value: 0, isPositive: false }}
        />
      </div>

      {/* Filters Section */}
      <FormSection title="Selection Criteria">
        <div className="space-y-4">
          {/* Row 1: Gate Entry Number */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">GATE Entry Number</Label>
            </div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                placeholder="From" 
                value={filters.gateEntryNoFrom} 
                onChange={(v) => setFilters({...filters, gateEntryNoFrom: v})} 
              />
            </div>
            <div className="md:col-span-1 text-center text-muted-foreground">to</div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                placeholder="To" 
                value={filters.gateEntryNoTo} 
                onChange={(v) => setFilters({...filters, gateEntryNoTo: v})} 
              />
            </div>
          </div>

          {/* Row 2: Entry Date */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Entry Date</Label>
            </div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                type="date" 
                value={filters.entryDateFrom} 
                onChange={(v) => setFilters({...filters, entryDateFrom: v})} 
              />
            </div>
            <div className="md:col-span-1 text-center text-muted-foreground">to</div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                type="date" 
                value={filters.entryDateTo} 
                onChange={(v) => setFilters({...filters, entryDateTo: v})} 
              />
            </div>
          </div>

          {/* Row 3: Plant */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Plant</Label>
            </div>
            <div className="md:col-span-4">
              <SelectField 
                label="" 
                value={filters.plant} 
                onChange={(v) => setFilters({...filters, plant: v})} 
                options={[
                  { value: '3601', label: '3601' },
                  { value: '3602', label: '3602' },
                ]} 
                placeholder="Select Plant"
              />
            </div>
            <div className="md:col-span-1 text-center text-muted-foreground">to</div>
            <div className="md:col-span-4">
              <SelectField 
                label="" 
                value={filters.plantTo} 
                onChange={(v) => setFilters({...filters, plantTo: v})} 
                options={[
                  { value: '3601', label: '3601' },
                  { value: '3602', label: '3602' },
                ]} 
                placeholder="Select Plant"
              />
            </div>
          </div>

          {/* Row 4: Vehicle No */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Vehicle No</Label>
            </div>
            <div className="md:col-span-9">
              <TextField 
                label="" 
                placeholder="Enter Vehicle Number" 
                value={filters.vehicleNo} 
                onChange={(v) => setFilters({...filters, vehicleNo: v})} 
              />
            </div>
          </div>

          {/* Row 5: Invoice Number */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Invoice Number</Label>
            </div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                placeholder="From" 
                value={filters.invoiceNoFrom} 
                onChange={(v) => setFilters({...filters, invoiceNoFrom: v})} 
              />
            </div>
            <div className="md:col-span-1 text-center text-muted-foreground">to</div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                placeholder="To" 
                value={filters.invoiceNoTo} 
                onChange={(v) => setFilters({...filters, invoiceNoTo: v})} 
              />
            </div>
          </div>

          {/* Row 6: Sales Organization */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Sales Organization</Label>
            </div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                placeholder="From" 
                value={filters.salesOrgFrom} 
                onChange={(v) => setFilters({...filters, salesOrgFrom: v})} 
              />
            </div>
            <div className="md:col-span-1 text-center text-muted-foreground">to</div>
            <div className="md:col-span-4">
              <TextField 
                label="" 
                placeholder="To" 
                value={filters.salesOrgTo} 
                onChange={(v) => setFilters({...filters, salesOrgTo: v})} 
              />
            </div>
          </div>

          {/* Row 7: Process Type Radio */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
            <div className="md:col-span-2"></div>
            <div className="md:col-span-9">
              <RadioGroup 
                value={filters.processType} 
                onValueChange={(v) => setFilters({...filters, processType: v as 'inward' | 'outward' | 'both'})}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inward" id="inward" />
                  <Label htmlFor="inward" className="cursor-pointer">Inward Process</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outward" id="outward" />
                  <Label htmlFor="outward" className="cursor-pointer">Outward Process</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="cursor-pointer">Both Process</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              Execute
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export to Excel
            </Button>
          </div>
        </div>
      </FormSection>

      {/* Results Table */}
      {showResults && (
        <FormSection title={`Results (${results.length} entries)`}>
          <div className="data-grid overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Gate Entry No</th>
                  <th className="whitespace-nowrap">Plant</th>
                  <th className="whitespace-nowrap">Type</th>
                  <th className="whitespace-nowrap">Vehicle Date</th>
                  <th className="whitespace-nowrap">Vehicle No</th>
                  <th className="whitespace-nowrap">Driver</th>
                  <th className="whitespace-nowrap">Transporter</th>
                  <th className="whitespace-nowrap">Ref Type</th>
                  <th className="whitespace-nowrap">PO No</th>
                  <th className="whitespace-nowrap">Material</th>
                  <th className="whitespace-nowrap">Vendor</th>
                  <th className="whitespace-nowrap">Qty</th>
                  <th className="whitespace-nowrap">Exit</th>
                  <th className="whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.gateEntryNo} className="hover:bg-muted/50 cursor-pointer">
                    <td className="text-accent font-medium whitespace-nowrap">{r.gateEntryNo}</td>
                    <td>{r.plant}</td>
                    <td>
                      <span className={`badge-status ${r.type === 'IN' ? 'badge-success' : 'badge-info'}`}>
                        {r.type === 'IN' ? 'Inward' : 'Outward'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">{r.vehicleDate}</td>
                    <td className="whitespace-nowrap">{r.vehicleNo}</td>
                    <td>{r.driverName}</td>
                    <td>{r.transporterName}</td>
                    <td>{r.refDocType}</td>
                    <td>{r.poNo || '-'}</td>
                    <td className="max-w-[150px] truncate" title={r.materialDesc}>{r.materialDesc}</td>
                    <td className="max-w-[150px] truncate" title={r.vendorName}>{r.vendorName}</td>
                    <td>{r.quantity} {r.unit}</td>
                    <td>
                      {r.vehicleExit ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </td>
                    <td>
                      {r.cancelled ? (
                        <span className="badge-status badge-danger">Cancelled</span>
                      ) : r.vehicleExit ? (
                        <span className="badge-status badge-success">Completed</span>
                      ) : (
                        <span className="badge-status badge-warning">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormSection>
      )}
    </div>
  );
}
