import { useState } from 'react';
import { Search, Printer, FileDown } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField } from '@/components/shared/FormField';
import { DataGrid } from '@/components/shared/DataGrid';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ItemRow {
  materialCode: string;
  materialDescription: string;
  poQty: string;
  poUnit: string;
  gateEntryQty: string;
  unit: string;
  packingCondition: string;
}

const generateSampleItems = (): ItemRow[] => {
  const materials = [
    { code: 'MAT001', desc: 'Steel Plate 10mm', unit: 'KG' },
    { code: 'MAT002', desc: 'Copper Wire 2.5mm', unit: 'MTR' },
    { code: 'MAT003', desc: 'Aluminium Rod 8mm', unit: 'NOS' },
    { code: 'MAT004', desc: 'Iron Sheet 5mm', unit: 'KG' },
    { code: 'MAT005', desc: 'Brass Fitting 1"', unit: 'NOS' },
    { code: 'MAT006', desc: 'PVC Pipe 2"', unit: 'MTR' },
    { code: 'MAT007', desc: 'Rubber Gasket', unit: 'NOS' },
    { code: 'MAT008', desc: 'Stainless Steel Bolt M10', unit: 'NOS' },
    { code: 'MAT009', desc: 'Welding Rod 3.15mm', unit: 'KG' },
    { code: 'MAT010', desc: 'Electric Cable 4sq', unit: 'MTR' },
  ];
  const conditions = ['Good', 'Damaged', 'Partial'];
  const items: ItemRow[] = [];
  
  for (let i = 0; i < 48; i++) {
    const mat = materials[i % materials.length];
    const poQty = Math.floor(Math.random() * 500) + 50;
    const gateQty = Math.floor(poQty * (0.8 + Math.random() * 0.2));
    items.push({
      materialCode: `${mat.code}-${String(i + 1).padStart(3, '0')}`,
      materialDescription: `${mat.desc} - Batch ${i + 1}`,
      poQty: String(poQty),
      poUnit: mat.unit,
      gateEntryQty: String(gateQty),
      unit: mat.unit,
      packingCondition: conditions[Math.floor(Math.random() * conditions.length)],
    });
  }
  return items;
};

export default function DisplayEntry() {
  const [gateEntryNo, setGateEntryNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [headerData, setHeaderData] = useState({
    plant: '',
    gateEntryType: '',
    vehicleDate: '',
    vehicleTime: '',
    vehicleNo: '',
    vehicleType: '',
    driverName: '',
    driverContact: '',
    transporterName: '',
    grLrNumber: '',
    poNumber: '',
    vendorNumber: '',
    vendorName: '',
    inwardedBy: '',
    createdAt: '',
    createdBy: '',
  });

  const [items, setItems] = useState<ItemRow[]>([]);

  const handleFetch = () => {
    if (!gateEntryNo) {
      toast.error('Please enter Gate Entry Number');
      return;
    }

    setIsLoading(true);
    // Simulate fetching gate entry data
    setTimeout(() => {
      setHeaderData({
        plant: '1000 - Main Plant',
        gateEntryType: 'Inward - PO Reference',
        vehicleDate: '2024-01-15',
        vehicleTime: '10:30',
        vehicleNo: 'MH-12-AB-1234',
        vehicleType: 'Truck',
        driverName: 'Ramesh Kumar',
        driverContact: '+91 98765 43210',
        transporterName: 'Fast Logistics',
        grLrNumber: 'GR-2024-001',
        poNumber: '4500001234',
        vendorNumber: 'V1001',
        vendorName: 'ABC Suppliers Pvt. Ltd.',
        inwardedBy: 'Admin User',
        createdAt: '2024-01-15 10:35:22',
        createdBy: 'Admin User',
      });
      setItems(generateSampleItems());
      setIsLoaded(true);
      setIsLoading(false);
      toast.success('Gate Entry displayed');
    }, 1000);
  };

  const handlePrint = () => {
    toast.success('Preparing print preview...');
  };

  const columns = [
    { key: 'materialCode', header: 'Material Code', width: '120px' },
    { key: 'materialDescription', header: 'Material Description', width: '200px' },
    { key: 'poQty', header: 'PO Qty', width: '80px' },
    { key: 'poUnit', header: 'PO Unit', width: '80px' },
    { key: 'gateEntryQty', header: 'Gate Entry Qty', width: '120px' },
    { key: 'unit', header: 'Unit', width: '80px' },
    { key: 'packingCondition', header: 'Packing Condition', width: '150px' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Display Gate Entry"
        subtitle="View gate entry details (read-only)"
        breadcrumbs={[{ label: 'Display' }]}
        actions={
          isLoaded && (
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
          )
        }
      />

      {/* Gate Entry Reference Section */}
      <FormSection title="Search Gate Entry">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField
            label="Gate Entry Number"
            value={gateEntryNo}
            onChange={setGateEntryNo}
            placeholder="Enter Gate Entry No (e.g., GE-2024-001)"
            required
          />
          <div className="flex items-end">
            <Button onClick={handleFetch} disabled={isLoading} className="gap-2 w-full">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Display Entry
            </Button>
          </div>
        </div>
      </FormSection>

      {!isLoaded ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileDown className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Enter Gate Entry Number to view details</p>
        </div>
      ) : (
        <>
          {/* Header Information */}
          <FormSection title="Header Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField label="Gate Entry No" value={gateEntryNo} readOnly />
              <TextField label="Plant" value={headerData.plant} readOnly />
              <TextField label="Gate Entry Type" value={headerData.gateEntryType} readOnly />
              <TextField label="Vehicle Date" value={headerData.vehicleDate} readOnly />
              <TextField label="Vehicle Time" value={headerData.vehicleTime} readOnly />
            </div>
          </FormSection>

          {/* Vehicle & Transport Details */}
          <FormSection title="Vehicle & Transport Details">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField label="Vehicle No" value={headerData.vehicleNo} readOnly />
              <TextField label="Vehicle Type" value={headerData.vehicleType} readOnly />
              <TextField label="Driver Name" value={headerData.driverName} readOnly />
              <TextField label="Driver Contact" value={headerData.driverContact} readOnly />
              <TextField label="Transporter Name" value={headerData.transporterName} readOnly />
              <TextField label="GR/LR Number" value={headerData.grLrNumber} readOnly />
            </div>
          </FormSection>

          {/* Vendor/Reference Details */}
          <FormSection title="Reference Details">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField label="PO Number" value={headerData.poNumber} readOnly />
              <TextField label="Vendor Number" value={headerData.vendorNumber} readOnly />
              <TextField label="Vendor Name" value={headerData.vendorName} readOnly />
              <TextField label="Inwarded By" value={headerData.inwardedBy} readOnly />
            </div>
          </FormSection>

          {/* Item Grid */}
          <FormSection title="Item Details">
            <DataGrid 
              columns={columns} 
              data={items} 
              maxHeight="350px"
              itemsPerPage={10}
            />
          </FormSection>

          {/* Audit Information */}
          <FormSection title="Audit Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField label="Created At" value={headerData.createdAt} readOnly />
              <TextField label="Created By" value={headerData.createdBy} readOnly />
            </div>
          </FormSection>
        </>
      )}
    </div>
  );
}
