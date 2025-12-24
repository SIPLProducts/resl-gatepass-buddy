import { useState } from 'react';
import { Search, DoorOpen } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField } from '@/components/shared/FormField';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function VehicleExit() {
  const [gateEntryNo, setGateEntryNo] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Gate Entry Header (read-only, fetched from system)
  const [headerData, setHeaderData] = useState({
    gateEntryNumber: '',
    plant: '',
    checkInDate: '',
    checkInTime: '',
    vehicleNumber: '',
    driver: '',
  });

  // Exit Details (editable)
  const [exitData, setExitData] = useState({
    checkOutDate: new Date().toISOString().split('T')[0],
    checkOutTime: new Date().toTimeString().slice(0, 5),
    inwardedBy: '',
    remarks: '',
  });

  const handleFetch = () => {
    if (!gateEntryNo) {
      toast.error('Enter Gate Entry No');
      return;
    }
    // Simulate fetching gate entry data
    setHeaderData({
      gateEntryNumber: gateEntryNo,
      plant: '3601',
      checkInDate: '23.12.2025',
      checkInTime: '22:25:10',
      vehicleNumber: 'TS098ERT',
      driver: 'ABC',
    });
    setIsLoaded(true);
    toast.success('Entry loaded');
  };

  const handleSave = () => {
    if (!exitData.inwardedBy) {
      toast.error('Please enter Inwarded By');
      return;
    }
    toast.success('Vehicle exit recorded!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Exit"
        subtitle="Record vehicle departure"
        breadcrumbs={[{ label: 'Vehicle Exit' }]}
      />

      <FormSection title="Fetch Entry">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField
            label="Gate Entry Number"
            value={gateEntryNo}
            onChange={setGateEntryNo}
            placeholder="Enter Gate Entry No"
            required
          />
          <div className="flex items-end">
            <Button onClick={handleFetch} className="gap-2 w-full">
              <Search className="w-4 h-4" />
              Fetch
            </Button>
          </div>
        </div>
      </FormSection>

      {isLoaded && (
        <>
          <FormSection title="Gate Entry Header">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Gate Entry Number"
                value={headerData.gateEntryNumber}
                onChange={() => {}}
                disabled
              />
              <TextField
                label="Check-in Date"
                value={headerData.checkInDate}
                onChange={() => {}}
                disabled
              />
              <TextField
                label="Vehicle Number"
                value={headerData.vehicleNumber}
                onChange={() => {}}
                disabled
              />
              <TextField
                label="Plant"
                value={headerData.plant}
                onChange={() => {}}
                disabled
              />
              <TextField
                label="Check-in Time"
                value={headerData.checkInTime}
                onChange={() => {}}
                disabled
              />
              <TextField
                label="Driver"
                value={headerData.driver}
                onChange={() => {}}
                disabled
              />
            </div>
          </FormSection>

          <FormSection title="Gate Entry Exit">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Check-out Date"
                type="date"
                value={exitData.checkOutDate}
                onChange={(v) => setExitData({ ...exitData, checkOutDate: v })}
                required
              />
              <TextField
                label="Check-out Time"
                type="time"
                value={exitData.checkOutTime}
                onChange={(v) => setExitData({ ...exitData, checkOutTime: v })}
                required
              />
              <TextField
                label="Inwarded By"
                value={exitData.inwardedBy}
                onChange={(v) => setExitData({ ...exitData, inwardedBy: v })}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="mt-4">
              <Label>Remarks</Label>
              <Textarea
                value={exitData.remarks}
                onChange={(e) => setExitData({ ...exitData, remarks: e.target.value })}
                placeholder="Enter remarks"
                className="mt-1.5"
              />
            </div>
            <Button onClick={handleSave} className="mt-4 bg-accent text-accent-foreground gap-2">
              <DoorOpen className="w-4 h-4" />
              Record Exit
            </Button>
          </FormSection>
        </>
      )}
    </div>
  );
}
