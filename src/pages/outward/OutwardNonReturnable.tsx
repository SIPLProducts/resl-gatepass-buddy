import { useState } from 'react';
import { Save, RotateCcw, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ItemRow {
  materialDescription: string;
  quantity: string;
  unit: string;
}

const emptyItem: ItemRow = { materialDescription: '', quantity: '', unit: '' };

export default function OutwardNonReturnable() {
  const [headerData, setHeaderData] = useState({
    gatePassNo: '',
    plant: '',
    gateEntryType: 'Outward - Non-Returnable',
    vehicleDate: new Date().toISOString().split('T')[0],
    vehicleTime: new Date().toTimeString().slice(0, 5),
    vehicleNo: '',
    driverName: '',
    transporterName: '',
  });

  const [items, setItems] = useState<ItemRow[]>(Array(5).fill(null).map(() => ({ ...emptyItem })));

  const handleItemChange = (index: number, field: keyof ItemRow, value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleAddRow = () => {
    setItems(prev => [...prev, { ...emptyItem }]);
  };

  const handleDeleteRow = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    toast.success('Gate Pass saved successfully!');
  };

  const handleReset = () => {
    setHeaderData({
      gatePassNo: '',
      plant: '',
      gateEntryType: 'Outward - Non-Returnable',
      vehicleDate: new Date().toISOString().split('T')[0],
      vehicleTime: new Date().toTimeString().slice(0, 5),
      vehicleNo: '',
      driverName: '',
      transporterName: '',
    });
    setItems(Array(5).fill(null).map(() => ({ ...emptyItem })));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outward Gate Pass - Non-Returnable"
        subtitle="Create non-returnable gate pass for outgoing materials"
        breadcrumbs={[{ label: 'Outward', path: '/outward/non-returnable' }, { label: 'Non-Returnable' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Save className="w-4 h-4" />
              Save Entry
            </Button>
          </div>
        }
      />

      <FormSection title="Header Information">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Pass No" value={headerData.gatePassNo} placeholder="Auto-generated" readOnly />
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
          <TextField label="Gate Entry Type" value={headerData.gateEntryType} readOnly />
          <TextField label="Vehicle Date" type="date" value={headerData.vehicleDate} onChange={(value) => setHeaderData({ ...headerData, vehicleDate: value })} required />
          <TextField label="Vehicle Time" type="time" value={headerData.vehicleTime} onChange={(value) => setHeaderData({ ...headerData, vehicleTime: value })} required />
        </div>
      </FormSection>

      <FormSection title="Vehicle & Transport Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField label="Vehicle No" value={headerData.vehicleNo} onChange={(value) => setHeaderData({ ...headerData, vehicleNo: value })} placeholder="MH-12-AB-1234" required />
          <TextField label="Driver Name" value={headerData.driverName} onChange={(value) => setHeaderData({ ...headerData, driverName: value })} placeholder="Enter driver name" />
          <TextField label="Transporter Name" value={headerData.transporterName} onChange={(value) => setHeaderData({ ...headerData, transporterName: value })} placeholder="Enter transporter" />
        </div>
      </FormSection>

      <FormSection title="Item Details">
        <div className="data-grid">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-12 text-center">#</th>
                <th>Material Description</th>
                <th className="w-32">Quantity</th>
                <th className="w-32">Unit</th>
                <th className="w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="group">
                  <td className="text-center font-medium text-muted-foreground">{index + 1}</td>
                  <td>
                    <Input value={item.materialDescription} onChange={(e) => handleItemChange(index, 'materialDescription', e.target.value)} className="h-8" placeholder="Enter material description" />
                  </td>
                  <td>
                    <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="h-8" placeholder="Qty" />
                  </td>
                  <td>
                    <Input value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} className="h-8" placeholder="Unit" />
                  </td>
                  <td className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(index)} disabled={items.length <= 1} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100">×</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" size="sm" onClick={handleAddRow} className="mt-3 gap-2">
          <Plus className="w-4 h-4" />
          Add Row
        </Button>
      </FormSection>
    </div>
  );
}
