import { useState } from 'react';
import { Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
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
  packingCondition: string;
}

const emptyItem: ItemRow = {
  materialDescription: '',
  quantity: '',
  unit: '',
  packingCondition: '',
};

const ITEMS_PER_PAGE = 5;

export default function InwardWithoutReference() {
  const [headerData, setHeaderData] = useState({
    gateEntryNo: '',
    plant: '',
    refDocType: 'Without Reference',
    gateEntryType: 'Inward',
    vehicleDate: new Date().toISOString().split('T')[0],
    vehicleTime: new Date().toTimeString().slice(0, 5),
    vehicleNo: '',
    driverName: '',
    transporterName: '',
    vendorName: '',
    inwardedBy: 'Admin User',
  });

  const [items, setItems] = useState<ItemRow[]>(Array(5).fill(null).map(() => ({ ...emptyItem })));
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, endIndex);

  const handleItemChange = (pageIndex: number, field: keyof ItemRow, value: string) => {
    const actualIndex = startIndex + pageIndex;
    setItems(prev => prev.map((item, i) => 
      i === actualIndex ? { ...item, [field]: value } : item
    ));
  };

  const handleAddRow = () => {
    setItems(prev => [...prev, { ...emptyItem }]);
    // Navigate to last page when adding new row
    const newTotalPages = Math.ceil((items.length + 1) / ITEMS_PER_PAGE);
    setCurrentPage(newTotalPages);
  };

  const handleDeleteRow = (pageIndex: number) => {
    const actualIndex = startIndex + pageIndex;
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== actualIndex));
      // Adjust page if necessary
      const newTotalPages = Math.ceil((items.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handleSave = () => {
    toast.success('Gate Entry saved successfully!');
  };

  const handleReset = () => {
    setHeaderData({
      gateEntryNo: '',
      plant: '',
      refDocType: 'Without Reference',
      gateEntryType: 'Inward',
      vehicleDate: new Date().toISOString().split('T')[0],
      vehicleTime: new Date().toTimeString().slice(0, 5),
      vehicleNo: '',
      driverName: '',
      transporterName: '',
      vendorName: '',
      inwardedBy: 'Admin User',
    });
    setItems(Array(5).fill(null).map(() => ({ ...emptyItem })));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inward Gate Entry - Without Reference"
        subtitle="Create gate entry with manual item entry"
        breadcrumbs={[{ label: 'Inward', path: '/inward/without-reference' }, { label: 'Without Reference' }]}
      />

      <FormSection title="Header Information">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Entry No" value={headerData.gateEntryNo} placeholder="Auto-generated" readOnly />
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
          <TextField label="Transporter Name" value={headerData.transporterName} onChange={(value) => setHeaderData({ ...headerData, transporterName: value })} placeholder="Enter transporter" />
          <TextField label="Vendor Name" value={headerData.vendorName} onChange={(value) => setHeaderData({ ...headerData, vendorName: value })} placeholder="Enter vendor name" />
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
                <th className="w-40">Packing Condition</th>
                <th className="w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, pageIndex) => {
                const actualIndex = startIndex + pageIndex;
                return (
                  <tr key={actualIndex} className="group">
                    <td className="text-center font-medium text-muted-foreground">{actualIndex + 1}</td>
                    <td>
                      <Input
                        value={item.materialDescription}
                        onChange={(e) => handleItemChange(pageIndex, 'materialDescription', e.target.value)}
                        className="h-8"
                        placeholder="Enter material description"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(pageIndex, 'quantity', e.target.value)}
                        className="h-8"
                        placeholder="Qty"
                      />
                    </td>
                    <td>
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(pageIndex, 'unit', e.target.value)}
                        className="h-8"
                        placeholder="Unit"
                      />
                    </td>
                    <td>
                      <Input
                        value={item.packingCondition}
                        onChange={(e) => handleItemChange(pageIndex, 'packingCondition', e.target.value)}
                        className="h-8"
                        placeholder="Good/Damaged"
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(pageIndex)}
                        disabled={items.length <= 1}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {items.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between pt-2 border-t mt-3">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, items.length)} of {items.length} items
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={handleAddRow} className="mt-3 gap-2">
          <Plus className="w-4 h-4" />
          Add Row
        </Button>

        {/* Save and Reset at end */}
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
      </FormSection>
    </div>
  );
}
