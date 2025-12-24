import { useState } from 'react';
import { Search, Save, RotateCcw, FileDown } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { DataGrid } from '@/components/shared/DataGrid';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ItemRow {
  materialCode: string;
  materialDescription: string;
  quantity: string;
  unit: string;
}

export default function OutwardBillingReference() {
  const [headerData, setHeaderData] = useState({
    gateEntryNo: '',
    plant: '',
    refDocType: 'Billing Reference',
    gateEntryType: 'Outward',
    vehicleDate: new Date().toISOString().split('T')[0],
    vehicleTime: new Date().toTimeString().slice(0, 5),
    vehicleNo: '',
    driverName: '',
    transporterName: '',
    billingDocNo: '',
    customerName: '',
  });

  const [items, setItems] = useState<ItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRow = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFetchBilling = () => {
    if (!headerData.billingDocNo || !headerData.plant) {
      toast.error('Please enter Billing Document No and Plant');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setHeaderData(prev => ({
        ...prev,
        customerName: 'XYZ Corporation Ltd.',
      }));
      setItems([
        { materialCode: 'FG001', materialDescription: 'Finished Product A', quantity: '50', unit: 'NOS' },
        { materialCode: 'FG002', materialDescription: 'Finished Product B', quantity: '100', unit: 'NOS' },
      ]);
      setIsLoading(false);
      toast.success('Billing data fetched successfully');
    }, 1000);
  };

  const handleSave = () => {
    toast.success('Gate Entry saved successfully!');
  };

  const handleReset = () => {
    setHeaderData({
      gateEntryNo: '',
      plant: '',
      refDocType: 'Billing Reference',
      gateEntryType: 'Outward',
      vehicleDate: new Date().toISOString().split('T')[0],
      vehicleTime: new Date().toTimeString().slice(0, 5),
      vehicleNo: '',
      driverName: '',
      transporterName: '',
      billingDocNo: '',
      customerName: '',
    });
    setItems([]);
  };

  const columns = [
    { key: 'materialCode', header: 'Material Code', width: '150px' },
    { key: 'materialDescription', header: 'Material Description', width: '300px' },
    { key: 'quantity', header: 'Quantity', width: '100px' },
    { key: 'unit', header: 'Unit', width: '100px' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outward Gate Entry - Billing Reference"
        subtitle="Create gate entry for outward materials with billing document"
        breadcrumbs={[{ label: 'Outward', path: '/outward/billing-reference' }, { label: 'Billing Reference' }]}
      />

      <FormSection title="Billing Reference">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            label="Billing Document No"
            value={headerData.billingDocNo}
            onChange={(value) => setHeaderData({ ...headerData, billingDocNo: value })}
            placeholder="Enter Billing Doc No"
            required
          />
          <div className="flex items-end">
            <Button onClick={handleFetchBilling} disabled={isLoading} className="gap-2 w-full">
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
          <TextField label="Vehicle Date" type="date" value={headerData.vehicleDate} onChange={(value) => setHeaderData({ ...headerData, vehicleDate: value })} required />
          <TextField label="Vehicle Time" type="time" value={headerData.vehicleTime} onChange={(value) => setHeaderData({ ...headerData, vehicleTime: value })} required />
        </div>
      </FormSection>

      <FormSection title="Vehicle & Customer Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Vehicle No" value={headerData.vehicleNo} onChange={(value) => setHeaderData({ ...headerData, vehicleNo: value })} placeholder="MH-12-AB-1234" required />
          <TextField label="Driver Name" value={headerData.driverName} onChange={(value) => setHeaderData({ ...headerData, driverName: value })} placeholder="Enter driver name" />
          <TextField label="Transporter Name" value={headerData.transporterName} onChange={(value) => setHeaderData({ ...headerData, transporterName: value })} placeholder="Enter transporter" />
          <TextField label="Customer Name" value={headerData.customerName} readOnly />
        </div>
      </FormSection>

      <FormSection title="Item Details">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No items loaded. Enter Billing Document No and click "Fetch Data" to load items.</p>
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
