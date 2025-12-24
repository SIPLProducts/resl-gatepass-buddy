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

export default function InwardPOReference() {
  const [headerData, setHeaderData] = useState({
    gateEntryNo: '',
    plant: '',
    refDocType: 'PO Reference',
    gateEntryType: 'Inward',
    vehicleDate: new Date().toISOString().split('T')[0],
    vehicleTime: new Date().toTimeString().slice(0, 5),
    vehicleNo: '',
    vehicleType: '',
    driverName: '',
    driverContact: '',
    transporterName: '',
    grLrNumber: '',
    poNumber: '',
    vendorNumber: '',
    vendorName: '',
    vendorAddress: '',
    vendorCity: '',
    vendorContact: '',
    vendorGSTNo: '',
    inwardedBy: 'Admin User',
  });

  const [items, setItems] = useState<ItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRow = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFetchPO = () => {
    if (!headerData.poNumber || !headerData.plant) {
      toast.error('Please enter PO Number and Plant');
      return;
    }

    setIsLoading(true);
    // Simulate SAP fetch
    setTimeout(() => {
      setHeaderData(prev => ({
        ...prev,
        vendorNumber: 'V1001',
        vendorName: 'ABC Suppliers Pvt. Ltd.',
        vendorAddress: '123, Industrial Area, Sector 5',
        vendorCity: 'Mumbai, Maharashtra - 400001',
        vendorContact: '+91 22 2345 6789',
        vendorGSTNo: '27AABCU9603R1ZM',
      }));
      setItems([
        { materialCode: 'MAT001', materialDescription: 'Steel Plate 10mm', poQty: '100', poUnit: 'KG', gateEntryQty: '', unit: 'KG', packingCondition: '' },
        { materialCode: 'MAT002', materialDescription: 'Copper Wire 2.5mm', poQty: '500', poUnit: 'MTR', gateEntryQty: '', unit: 'MTR', packingCondition: '' },
        { materialCode: 'MAT003', materialDescription: 'Aluminium Rod 8mm', poQty: '200', poUnit: 'NOS', gateEntryQty: '', unit: 'NOS', packingCondition: '' },
      ]);
      setIsLoading(false);
      toast.success('PO data fetched successfully');
    }, 1000);
  };

  const handleItemChange = (index: number, field: keyof ItemRow, value: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    toast.success('Gate Entry saved successfully!');
  };

  const handleReset = () => {
    setHeaderData({
      gateEntryNo: '',
      plant: '',
      refDocType: 'PO Reference',
      gateEntryType: 'Inward',
      vehicleDate: new Date().toISOString().split('T')[0],
      vehicleTime: new Date().toTimeString().slice(0, 5),
      vehicleNo: '',
      vehicleType: '',
      driverName: '',
      driverContact: '',
      transporterName: '',
      grLrNumber: '',
      poNumber: '',
      vendorNumber: '',
      vendorName: '',
      vendorAddress: '',
      vendorCity: '',
      vendorContact: '',
      vendorGSTNo: '',
      inwardedBy: 'Admin User',
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
          placeholder="Enter qty"
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
          placeholder="Good/Damaged"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inward Gate Entry - PO Reference"
        subtitle="Create gate entry by fetching data from Purchase Order"
        breadcrumbs={[{ label: 'Inward', path: '/inward/po-reference' }, { label: 'With PO Reference' }]}
      />

      {/* PO Reference Section */}
      <FormSection title="PO Reference">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <SelectField
            label="Plant"
            value={headerData.plant}
            onChange={(value) => setHeaderData({ ...headerData, plant: value })}
            options={[
              { value: '1000', label: '1000 - Main Plant' },
              { value: '2000', label: '2000 - Warehouse' },
              { value: '3000', label: '3000 - Factory' },
            ]}
            required
          />
          <TextField
            label="PO Number"
            value={headerData.poNumber}
            onChange={(value) => setHeaderData({ ...headerData, poNumber: value })}
            placeholder="Enter PO Number"
            required
          />
          <TextField
            label="Vendor Number"
            value={headerData.vendorNumber}
            readOnly
          />
          <TextField
            label="Vendor Name"
            value={headerData.vendorName}
            readOnly
          />
          <div className="pb-0.5">
            <Button onClick={handleFetchPO} disabled={isLoading} className="gap-2 w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Fetch PO Data
            </Button>
          </div>
        </div>
      </FormSection>

      {/* Header Information */}
      <FormSection title="Header Information">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField
            label="Gate Entry No"
            value={headerData.gateEntryNo}
            placeholder="Auto-generated"
            readOnly
          />
          <TextField
            label="Ref Doc Type"
            value={headerData.refDocType}
            readOnly
          />
          <TextField
            label="Gate Entry Type"
            value={headerData.gateEntryType}
            readOnly
          />
          <TextField
            label="Inwarded By"
            value={headerData.inwardedBy}
            readOnly
          />
          <TextField
            label="Vehicle Date"
            type="date"
            value={headerData.vehicleDate}
            onChange={(value) => setHeaderData({ ...headerData, vehicleDate: value })}
            required
          />
          <TextField
            label="Vehicle Time"
            type="time"
            value={headerData.vehicleTime}
            onChange={(value) => setHeaderData({ ...headerData, vehicleTime: value })}
            required
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
            placeholder="MH-12-AB-1234"
            required
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
            placeholder="Enter driver name"
          />
          <TextField
            label="Driver Contact"
            value={headerData.driverContact}
            onChange={(value) => setHeaderData({ ...headerData, driverContact: value })}
            placeholder="+91 98765 43210"
          />
          <TextField
            label="Transporter Name"
            value={headerData.transporterName}
            onChange={(value) => setHeaderData({ ...headerData, transporterName: value })}
            placeholder="Enter transporter name"
          />
          <TextField
            label="GR/LR Number"
            value={headerData.grLrNumber}
            onChange={(value) => setHeaderData({ ...headerData, grLrNumber: value })}
            placeholder="Enter GR/LR number"
          />
        </div>
      </FormSection>

      {/* Item Grid */}
      <FormSection title="Item Details">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No items loaded. Enter PO Number and click "Fetch PO Data" to load items.</p>
          </div>
        ) : (
          <>
            <DataGrid 
              columns={columns} 
              data={items} 
              editable={true}
              onRowDelete={handleDeleteRow}
              minRows={1}
              itemsPerPage={5}
            />
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Save className="w-4 h-4" />
                Save Entry
              </Button>
            </div>
          </>
        )}
      </FormSection>
    </div>
  );
}
