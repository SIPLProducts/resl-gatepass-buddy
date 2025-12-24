import { useState } from 'react';
import { Search, Save, RotateCcw, FileDown, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { DataGrid } from '@/components/shared/DataGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { exportToExcel, transporterOptions, generateTestItems } from '@/lib/exportToExcel';

interface ItemRow {
  materialCode: string;
  materialDescription: string;
  poQty: string;
  poUnit: string;
  balanceQty: string;
  quantity: string;
  unit: string;
  packingCondition: string;
}

export default function InwardSubcontracting() {
  const [headerData, setHeaderData] = useState({
    gateEntryNo: '',
    plant: '',
    refDocType: 'Subcontracting',
    gateEntryType: 'Inward',
    vehicleDate: new Date().toISOString().split('T')[0],
    vehicleTime: new Date().toTimeString().slice(0, 5),
    vehicleNo: '',
    driverName: '',
    transporterName: '',
    subcontractPONo: '',
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
    if (!headerData.plant) {
      toast.error('Please select Plant');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setHeaderData(prev => ({
        ...prev,
        vendorNumber: 'V2001',
        vendorName: 'Subcontractor Industries Ltd.',
        vendorAddress: '456, Industrial Zone, Phase 2',
        vendorCity: 'Pune, Maharashtra - 411001',
        vendorContact: '+91 20 2567 8901',
        vendorGSTNo: '27AABCU9603R1ZP',
      }));
      setItems(generateTestItems('subcontract') as ItemRow[]);
      setIsLoading(false);
      toast.success('Subcontract PO data fetched successfully - 35 items loaded');
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
      refDocType: 'Subcontracting',
      gateEntryType: 'Inward',
      vehicleDate: new Date().toISOString().split('T')[0],
      vehicleTime: new Date().toTimeString().slice(0, 5),
      vehicleNo: '',
      driverName: '',
      transporterName: '',
      subcontractPONo: '',
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

  const handleExport = () => {
    if (items.length === 0) {
      toast.error('No items to export');
      return;
    }
    const exportColumns = [
      { key: 'materialCode', header: 'Material Code' },
      { key: 'materialDescription', header: 'Material Description' },
      { key: 'poQty', header: 'PO Qty' },
      { key: 'poUnit', header: 'PO Unit' },
      { key: 'balanceQty', header: 'Balance Qty' },
      { key: 'quantity', header: 'Gate Entry Qty' },
      { key: 'unit', header: 'Unit' },
      { key: 'packingCondition', header: 'Packing Condition' },
    ];
    exportToExcel(items, exportColumns, `Inward_Subcontract_${headerData.subcontractPONo}`);
    toast.success('Exported to Excel successfully');
  };

  const columns = [
    { key: 'materialCode', header: 'Material Code', width: '120px' },
    { key: 'materialDescription', header: 'Material Description', width: '200px' },
    { key: 'poQty', header: 'PO Qty', width: '80px' },
    { key: 'poUnit', header: 'PO Unit', width: '70px' },
    { key: 'balanceQty', header: 'Balance Qty', width: '100px' },
    {
      key: 'quantity',
      header: 'Gate Entry Qty',
      width: '150px',
      render: (value: string, _row: ItemRow, index: number) => (
        <Input
          type="number"
          value={value}
          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
          className="h-8 w-full"
          placeholder="Enter qty"
        />
      ),
    },
    { key: 'unit', header: 'Unit', width: '70px' },
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
        title="Inward Gate Entry - Subcontracting"
        subtitle="Create gate entry for subcontracting materials"
        breadcrumbs={[{ label: 'Inward', path: '/inward/subcontracting' }, { label: 'Subcontracting' }]}
      />

      <FormSection title="Subcontract PO Reference">
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
            label="Subcontract PO Number"
            value={headerData.subcontractPONo}
            onChange={(value) => setHeaderData({ ...headerData, subcontractPONo: value })}
            placeholder="Enter Subcontract PO"
          />
          <TextField label="Vendor Number" value={headerData.vendorNumber} readOnly />
          <TextField label="Vendor Name" value={headerData.vendorName} readOnly />
          <div className="pb-0.5">
            <Button onClick={handleFetchPO} disabled={isLoading} className="gap-2 w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Fetch Data
            </Button>
          </div>
        </div>
      </FormSection>

      <FormSection title="Header Information">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Entry No" value={headerData.gateEntryNo} placeholder="Auto-generated" readOnly />
          <TextField label="Ref Doc Type" value={headerData.refDocType} readOnly />
          <TextField label="Gate Entry Type" value={headerData.gateEntryType} readOnly />
          <TextField label="Inwarded By" value={headerData.inwardedBy} readOnly />
          <TextField label="Vehicle Date" type="date" value={headerData.vehicleDate} onChange={(value) => setHeaderData({ ...headerData, vehicleDate: value })} required />
          <TextField label="Vehicle Time" type="time" value={headerData.vehicleTime} onChange={(value) => setHeaderData({ ...headerData, vehicleTime: value })} required />
        </div>
      </FormSection>

      <FormSection title="Vehicle & Transport Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Vehicle No" value={headerData.vehicleNo} onChange={(value) => setHeaderData({ ...headerData, vehicleNo: value })} placeholder="MH-12-AB-1234" required />
          <TextField label="Driver Name" value={headerData.driverName} onChange={(value) => setHeaderData({ ...headerData, driverName: value })} placeholder="Enter driver name" />
          <SelectField
            label="Transporter Name"
            value={headerData.transporterName}
            onChange={(value) => setHeaderData({ ...headerData, transporterName: value })}
            options={transporterOptions}
          />
        </div>
      </FormSection>

      <FormSection title="Item Details">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No items loaded. Select Plant and click "Fetch Data" to load items.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-3">
              <Button variant="outline" onClick={handleExport} className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export to Excel
              </Button>
            </div>
            <DataGrid 
              columns={columns} 
              data={items} 
              editable={true}
              onRowDelete={handleDeleteRow}
              minRows={1}
              itemsPerPage={10}
              maxHeight="400px"
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
