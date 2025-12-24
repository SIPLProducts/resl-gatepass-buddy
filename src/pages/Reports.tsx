import { Search, Download, FileSpreadsheet, Package, Truck, Clock, XCircle, CheckCircle, Filter, ChevronDown, BarChart3, PieChart as PieChartIcon, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { exportToExcel } from '@/lib/exportToExcel';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data based on Excel structure
const mockData = [
  { gateEntryNo: 'A624A00001', plant: '3601', type: 'IN', vehicleDate: '2024-01-03', vehicleTime: '12:06 AM', vehicleOutDate: '', vehicleNo: '123456788', driverName: 'RAJ', transporterName: 'RAJ', refDocType: 'PO', poNo: '100109798', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '5000024', vendorName: 'Ramky Enviro Engineers Limited', quantity: 80, unit: 'SET', vehicleExit: false, cancelled: true, salesOrg: '3600', invoiceNo: '' },
  { gateEntryNo: 'A624A00002', plant: '3601', type: 'IN', vehicleDate: '2024-01-03', vehicleTime: '12:36 AM', vehicleOutDate: '', vehicleNo: '123456788', driverName: 'RAJ', transporterName: 'RAJ', refDocType: 'PO', poNo: '100109798', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '5000024', vendorName: 'Ramky Enviro Engineers Limited', quantity: 80, unit: 'SET', vehicleExit: false, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-001' },
  { gateEntryNo: 'A624A00003', plant: '3601', type: 'IN', vehicleDate: '2024-01-03', vehicleTime: '11:43 AM', vehicleOutDate: '', vehicleNo: 'AP37AZ1235', driverName: 'TEST', transporterName: 'VYSHNAVI', refDocType: 'PO', poNo: '100109799', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '5000024', vendorName: 'Ramky Enviro Engineers Limited', quantity: 800, unit: 'SET', vehicleExit: false, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-002' },
  { gateEntryNo: 'A624A00004', plant: '3601', type: 'IN', vehicleDate: '2024-01-15', vehicleTime: '09:30 AM', vehicleOutDate: '2024-01-15', vehicleNo: 'TS09KL4567', driverName: 'KUMAR', transporterName: 'BLUE DART', refDocType: 'SUB', poNo: '100109800', materialCode: '300045678', materialDesc: 'Spare Parts', vendorNo: '5000025', vendorName: 'Tata Motors Ltd.', quantity: 150, unit: 'NOS', vehicleExit: true, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-003' },
  { gateEntryNo: 'A624B00001', plant: '3601', type: 'OUT', vehicleDate: '2024-02-01', vehicleTime: '10:00 AM', vehicleOutDate: '2024-02-01', vehicleNo: 'TS07DE3456', driverName: 'SURESH', transporterName: 'VYSHNAVI', refDocType: 'SO', poNo: '', materialCode: '200092993', materialDesc: 'OEM 5% GST', vendorNo: '1001706', vendorName: 'Tata Motors Ltd.', quantity: 50, unit: 'SET', vehicleExit: true, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-004' },
  { gateEntryNo: 'A624B00002', plant: '3601', type: 'OUT', vehicleDate: '2024-02-02', vehicleTime: '02:30 PM', vehicleOutDate: '2024-02-02', vehicleNo: 'MH12AB1234', driverName: 'MOHAN', transporterName: 'BLUE DART', refDocType: 'SO', poNo: '', materialCode: '300045678', materialDesc: 'Spare Parts Kit', vendorNo: '1001707', vendorName: 'Mahindra Ltd.', quantity: 25, unit: 'NOS', vehicleExit: true, cancelled: false, salesOrg: '3600', invoiceNo: 'INV-005' },
  { gateEntryNo: 'A624B00003', plant: '3602', type: 'OUT', vehicleDate: '2024-02-10', vehicleTime: '11:15 AM', vehicleOutDate: '2024-02-10', vehicleNo: 'KA05MN8901', driverName: 'RAVI', transporterName: 'GATI', refDocType: 'SO', poNo: '', materialCode: '400012345', materialDesc: 'Assembly Unit', vendorNo: '5000026', vendorName: 'Bharat Forge', quantity: 75, unit: 'KG', vehicleExit: true, cancelled: false, salesOrg: '3601', invoiceNo: 'INV-006' },
  { gateEntryNo: 'A624C00001', plant: '3602', type: 'IN', vehicleDate: '2024-03-15', vehicleTime: '09:15 AM', vehicleOutDate: '2024-03-15', vehicleNo: 'KA01MN5678', driverName: 'RAVI', transporterName: 'GATI', refDocType: 'SUB', poNo: '100110001', materialCode: '400012345', materialDesc: 'Sub Assembly Part', vendorNo: '5000025', vendorName: 'Bharat Forge', quantity: 100, unit: 'KG', vehicleExit: true, cancelled: false, salesOrg: '3601', invoiceNo: 'INV-007' },
  { gateEntryNo: 'A624C00002', plant: '3602', type: 'IN', vehicleDate: '2024-03-20', vehicleTime: '03:45 PM', vehicleOutDate: '', vehicleNo: 'AP09XY2345', driverName: 'KRISHNA', transporterName: 'DTDC', refDocType: 'PO', poNo: '100110002', materialCode: '500067890', materialDesc: 'Electronic Components', vendorNo: '5000027', vendorName: 'Samsung Electronics', quantity: 200, unit: 'PCS', vehicleExit: false, cancelled: false, salesOrg: '3601', invoiceNo: 'INV-008' },
  { gateEntryNo: 'A624C00003', plant: '3602', type: 'OUT', vehicleDate: '2024-03-25', vehicleTime: '08:00 AM', vehicleOutDate: '2024-03-25', vehicleNo: 'TN10AB6789', driverName: 'MURUGAN', transporterName: 'DELHIVERY', refDocType: 'SO', poNo: '', materialCode: '600078901', materialDesc: 'Finished Goods', vendorNo: '5000028', vendorName: 'Ashok Leyland', quantity: 30, unit: 'SET', vehicleExit: true, cancelled: false, salesOrg: '3601', invoiceNo: 'INV-009' },
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

const CHART_COLORS = {
  primary: 'hsl(213, 50%, 23%)',
  accent: 'hsl(166, 72%, 35%)',
  success: 'hsl(152, 69%, 40%)',
  warning: 'hsl(38, 92%, 50%)',
  info: 'hsl(199, 89%, 48%)',
  destructive: 'hsl(0, 72%, 51%)',
};

const PIE_COLORS = [CHART_COLORS.accent, CHART_COLORS.info, CHART_COLORS.warning, CHART_COLORS.success, CHART_COLORS.destructive];

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
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [activeView, setActiveView] = useState<'charts' | 'table'>('charts');

  // Calculate KPIs
  const kpis = useMemo(() => ({
    totalEntries: results.length,
    inwardEntries: results.filter(r => r.type === 'IN').length,
    outwardEntries: results.filter(r => r.type === 'OUT').length,
    vehiclesExited: results.filter(r => r.vehicleExit).length,
    vehiclesPending: results.filter(r => !r.vehicleExit && !r.cancelled).length,
    cancelledEntries: results.filter(r => r.cancelled).length,
    totalQuantity: results.reduce((sum, r) => sum + r.quantity, 0),
  }), [results]);

  // Chart data
  const typeChartData = useMemo(() => [
    { name: 'Inward', value: kpis.inwardEntries, fill: CHART_COLORS.accent },
    { name: 'Outward', value: kpis.outwardEntries, fill: CHART_COLORS.info },
  ], [kpis]);

  const statusChartData = useMemo(() => [
    { name: 'Completed', value: kpis.vehiclesExited, fill: CHART_COLORS.success },
    { name: 'Pending', value: kpis.vehiclesPending, fill: CHART_COLORS.warning },
    { name: 'Cancelled', value: kpis.cancelledEntries, fill: CHART_COLORS.destructive },
  ], [kpis]);

  const plantChartData = useMemo(() => {
    const plantCounts: Record<string, { inward: number; outward: number }> = {};
    results.forEach(r => {
      if (!plantCounts[r.plant]) plantCounts[r.plant] = { inward: 0, outward: 0 };
      if (r.type === 'IN') plantCounts[r.plant].inward++;
      else plantCounts[r.plant].outward++;
    });
    return Object.entries(plantCounts).map(([plant, counts]) => ({
      plant,
      Inward: counts.inward,
      Outward: counts.outward,
    }));
  }, [results]);

  const vendorChartData = useMemo(() => {
    const vendorCounts: Record<string, number> = {};
    results.forEach(r => {
      vendorCounts[r.vendorName] = (vendorCounts[r.vendorName] || 0) + 1;
    });
    return Object.entries(vendorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], idx) => ({ name: name.length > 20 ? name.substring(0, 20) + '...' : name, value, fill: PIE_COLORS[idx % PIE_COLORS.length] }));
  }, [results]);

  const refDocTypeData = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    results.forEach(r => {
      typeCounts[r.refDocType] = (typeCounts[r.refDocType] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([name, count]) => ({ name, count }));
  }, [results]);

  const handleSearch = () => {
    let filtered = [...mockData];

    if (filters.processType === 'inward') {
      filtered = filtered.filter(r => r.type === 'IN');
    } else if (filters.processType === 'outward') {
      filtered = filtered.filter(r => r.type === 'OUT');
    }

    if (filters.plant) {
      filtered = filtered.filter(r => r.plant >= filters.plant && (!filters.plantTo || r.plant <= filters.plantTo));
    }

    if (filters.vehicleNo) {
      filtered = filtered.filter(r => r.vehicleNo.toLowerCase().includes(filters.vehicleNo.toLowerCase()));
    }

    if (filters.entryDateFrom) {
      filtered = filtered.filter(r => r.vehicleDate >= filters.entryDateFrom);
    }
    if (filters.entryDateTo) {
      filtered = filtered.filter(r => r.vehicleDate <= filters.entryDateTo);
    }

    if (filters.gateEntryNoFrom) {
      filtered = filtered.filter(r => r.gateEntryNo >= filters.gateEntryNoFrom);
    }
    if (filters.gateEntryNoTo) {
      filtered = filtered.filter(r => r.gateEntryNo <= filters.gateEntryNoTo);
    }

    setResults(filtered);
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
    toast.success('Exported to Excel');
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
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gate Entry Report" 
        subtitle="Advanced analytics and reporting dashboard" 
        breadcrumbs={[{ label: 'Reports' }]} 
      />

      {/* Smart Filter Panel */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="enterprise-card">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Filter className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Selection Criteria</h3>
                  <p className="text-sm text-muted-foreground">Click to {isFilterOpen ? 'collapse' : 'expand'} filters</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-4 border-t border-border">
              {/* Filter Grid - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gate Entry Number Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Gate Entry Number</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="From" 
                      value={filters.gateEntryNoFrom} 
                      onChange={(e) => setFilters({...filters, gateEntryNoFrom: e.target.value})}
                      className="h-9"
                    />
                    <span className="text-muted-foreground text-sm">→</span>
                    <Input 
                      placeholder="To" 
                      value={filters.gateEntryNoTo} 
                      onChange={(e) => setFilters({...filters, gateEntryNoTo: e.target.value})}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Entry Date Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Entry Date</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="date" 
                      value={filters.entryDateFrom} 
                      onChange={(e) => setFilters({...filters, entryDateFrom: e.target.value})}
                      className="h-9"
                    />
                    <span className="text-muted-foreground text-sm">→</span>
                    <Input 
                      type="date" 
                      value={filters.entryDateTo} 
                      onChange={(e) => setFilters({...filters, entryDateTo: e.target.value})}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Plant Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Plant</Label>
                  <div className="flex items-center gap-2">
                    <Select value={filters.plant} onValueChange={(v) => setFilters({...filters, plant: v})}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3601">3601</SelectItem>
                        <SelectItem value="3602">3602</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-sm">→</span>
                    <Select value={filters.plantTo} onValueChange={(v) => setFilters({...filters, plantTo: v})}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3601">3601</SelectItem>
                        <SelectItem value="3602">3602</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Vehicle No */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Vehicle No</Label>
                  <Input 
                    placeholder="Enter Vehicle Number" 
                    value={filters.vehicleNo} 
                    onChange={(e) => setFilters({...filters, vehicleNo: e.target.value})}
                    className="h-9"
                  />
                </div>

                {/* Invoice Number Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Invoice Number</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="From" 
                      value={filters.invoiceNoFrom} 
                      onChange={(e) => setFilters({...filters, invoiceNoFrom: e.target.value})}
                      className="h-9"
                    />
                    <span className="text-muted-foreground text-sm">→</span>
                    <Input 
                      placeholder="To" 
                      value={filters.invoiceNoTo} 
                      onChange={(e) => setFilters({...filters, invoiceNoTo: e.target.value})}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Sales Organization Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sales Organization</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="From" 
                      value={filters.salesOrgFrom} 
                      onChange={(e) => setFilters({...filters, salesOrgFrom: e.target.value})}
                      className="h-9"
                    />
                    <span className="text-muted-foreground text-sm">→</span>
                    <Input 
                      placeholder="To" 
                      value={filters.salesOrgTo} 
                      onChange={(e) => setFilters({...filters, salesOrgTo: e.target.value})}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Process Type Radio */}
              <div className="pt-2">
                <Label className="text-sm font-medium mb-3 block">Process Type</Label>
                <RadioGroup 
                  value={filters.processType} 
                  onValueChange={(v) => setFilters({...filters, processType: v as 'inward' | 'outward' | 'both'})}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inward" id="inward" />
                    <Label htmlFor="inward" className="cursor-pointer font-normal">Inward Process</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outward" id="outward" />
                    <Label htmlFor="outward" className="cursor-pointer font-normal">Outward Process</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="cursor-pointer font-normal">Both Process</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="w-4 h-4" />
                  Execute
                </Button>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
                <Button variant="outline" onClick={handleExport} className="gap-2 ml-auto">
                  <Download className="w-4 h-4" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total', value: kpis.totalEntries, icon: FileSpreadsheet, color: 'bg-primary/10 text-primary' },
          { label: 'Inward', value: kpis.inwardEntries, icon: Package, color: 'bg-accent/10 text-accent' },
          { label: 'Outward', value: kpis.outwardEntries, icon: Truck, color: 'bg-info/10 text-info' },
          { label: 'Exited', value: kpis.vehiclesExited, icon: CheckCircle, color: 'bg-success/10 text-success' },
          { label: 'Pending', value: kpis.vehiclesPending, icon: Clock, color: 'bg-warning/10 text-warning' },
          { label: 'Cancelled', value: kpis.cancelledEntries, icon: XCircle, color: 'bg-destructive/10 text-destructive' },
          { label: 'Total Qty', value: kpis.totalQuantity.toLocaleString(), icon: BarChart3, color: 'bg-primary/10 text-primary' },
        ].map((item, idx) => (
          <div key={idx} className="enterprise-card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View Toggle & Content */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'charts' | 'table')} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-2 w-fit">
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Data Table
            </TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">{results.length} entries found</p>
        </div>

        <TabsContent value="charts" className="space-y-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inward vs Outward Pie Chart */}
            <div className="enterprise-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Entry Type Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status Pie Chart */}
            <div className="enterprise-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Status Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Plant-wise Bar Chart */}
            <div className="enterprise-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Plant-wise Entry Analysis</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={plantChartData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="plant" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Inward" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Outward" fill={CHART_COLORS.info} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Reference Document Type Bar Chart */}
            <div className="enterprise-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Reference Document Type</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={refDocTypeData} layout="vertical" barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Vendors Chart - Full Width */}
          <div className="enterprise-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Top 5 Vendors by Entry Count</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendorChartData} layout="vertical" barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={160} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Entries">
                  {vendorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="table">
          <div className="enterprise-card overflow-hidden">
            <div className="data-grid overflow-x-auto max-h-[500px] data-grid-scroll">
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
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <Clock className="w-4 h-4 text-warning" />
                        )}
                      </td>
                      <td>
                        {r.cancelled ? (
                          <span className="badge-status bg-destructive/10 text-destructive">Cancelled</span>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
