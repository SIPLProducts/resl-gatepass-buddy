import { useState } from 'react';
import { Search, Save, RotateCcw, FileDown } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { DataGrid } from '@/components/shared/DataGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function ChangeEntry() {
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
        plant: '1000',
        gateEntryType: 'Inward - PO Reference',
        vehicleDate: '2024-01-15',
        vehicleTime: '10:30',
        vehicleNo: 'MH-12-AB-1234',
        vehicleType: 'truck',
        driverName: 'Ramesh Kumar',
        driverContact: '+91 98765 43210',
        transporterName: 'Fast Logistics',
        grLrNumber: 'GR-2024-001',
        poNumber: '4500001234',
        vendorNumber: 'V1001',
        vendorName: 'ABC Suppliers Pvt. Ltd.',
        inwardedBy: 'Admin User',
      });
      setItems([
        { materialCode: 'MAT001', materialDescription: 'Steel Plate 10mm', poQty: '100', poUnit: 'KG', gateEntryQty: '95', unit: 'KG', packingCondition: 'Good' },
        { materialCode: 'MAT002', materialDescription: 'Copper Wire 2.5mm', poQty: '500', poUnit: 'MTR', gateEntryQty: '500', unit: 'MTR', packingCondition: 'Good' },
        { materialCode: 'MAT003', materialDescription: 'Aluminium Rod 8mm', poQty: '200', poUnit: 'NOS', gateEntryQty: '180', unit: 'NOS', packingCondition: 'Damaged' },
      ]);
      setIsLoaded(true);
      setIsLoading(false);
      toast.success('Gate Entry loaded successfully');
    }, 1000);
  };

  const handleItemChange = (index: number, field: keyof ItemRow, value: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteRow = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    toast.success('Gate Entry updated successfully!');
  };

  const handleReset = () => {
    setGateEntryNo('');
    setIsLoaded(false);
    setHeaderData({
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
    });
    setItems([]);
  };

  const columns = [
    { key: 'materialCode', header: 'Material Code', width: '120px' },
    { key: 'materialDescription', header: 'Material Description', width: '200px' },
    { key: 'poQty', header: 'PO Qty', width: '80px' },
    { key: 'poUnit', header: 'PO Unit', width: '80px' },
    {
      key: 'gateEntryQty',
      header: 'Gate Entry Qty',
      width: '120px',
      render: (value: string, _row: ItemRow, index: number) => (
        <Input
          type="number"
          value={value}
          onChange={(e) => handleItemChange(index, 'gateEntryQty', e.target.value)}
          className="h-8 w-full"
        />
      ),
    },
    { key: 'unit', header: 'Unit', width: '80px' },
    {
      key: 'packingCondition',
      header: 'Packing Condition',
      width: '150px',
      render: (value: string, _row: ItemRow, index: number) => (
        <Input
          value={value}
          onChange={(e) => handleItemChange(index, 'packingCondition', e.target.value)}
          className="h-8 w-full"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Gate Entry"
        subtitle="Modify existing gate entry records"
        breadcrumbs={[{ label: 'Change' }]}
        actions={
          isLoaded && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )
        }
      />

      {/* Gate Entry Reference Section */}
      <FormSection title="Gate Entry Reference">
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
              Fetch Entry
            </Button>
          </div>
        </div>
      </FormSection>

      {!isLoaded ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileDown className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Enter Gate Entry Number and click "Fetch Entry" to load data for modification</p>
        </div>
      ) : (
        <>
          {/* Header Information */}
          <FormSection title="Header Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField label="Gate Entry No" value={gateEntryNo} readOnly />
              <SelectField
                label="Plant"
                value={headerData.plant}
                onChange={(value) => setHeaderData({ ...headerData, plant: value })}
                options={[
                  { value: '1000', label: '1000 - Main Plant' },
                  { value: '2000', label: '2000 - Warehouse' },
                  { value: '3000', label: '3000 - Factory' },
                ]}
              />
              <TextField label="Gate Entry Type" value={headerData.gateEntryType} readOnly />
              <TextField
                label="Vehicle Date"
                type="date"
                value={headerData.vehicleDate}
                onChange={(value) => setHeaderData({ ...headerData, vehicleDate: value })}
              />
              <TextField
                label="Vehicle Time"
                type="time"
                value={headerData.vehicleTime}
                onChange={(value) => setHeaderData({ ...headerData, vehicleTime: value })}
              />
            </div>
          </FormSection>

          {/* Vehicle & Transport Details */}
          <FormSection title="Vehicle & Transport Details">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField
                label="Vehicle No"
                value={headerData.vehicleNo}
                onChange={(value) => setHeaderData({ ...headerData, vehicleNo: value })}
              />
              <SelectField
                label="Vehicle Type"
                value={headerData.vehicleType}
                onChange={(value) => setHeaderData({ ...headerData, vehicleType: value })}
                options={[
                  { value: 'truck', label: 'Truck' },
                  { value: 'tempo', label: 'Tempo' },
                  { value: 'container', label: 'Container' },
                  { value: 'trailer', label: 'Trailer' },
                ]}
              />
              <TextField
                label="Driver Name"
                value={headerData.driverName}
                onChange={(value) => setHeaderData({ ...headerData, driverName: value })}
              />
              <TextField
                label="Driver Contact"
                value={headerData.driverContact}
                onChange={(value) => setHeaderData({ ...headerData, driverContact: value })}
              />
              <TextField
                label="Transporter Name"
                value={headerData.transporterName}
                onChange={(value) => setHeaderData({ ...headerData, transporterName: value })}
              />
              <TextField
                label="GR/LR Number"
                value={headerData.grLrNumber}
                onChange={(value) => setHeaderData({ ...headerData, grLrNumber: value })}
              />
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
              editable={true}
              onRowDelete={handleDeleteRow}
              minRows={1}
            />
          </FormSection>
        </>
      )}
    </div>
  );
}
