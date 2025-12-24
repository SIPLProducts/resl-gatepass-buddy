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
  const [exitData, setExitData] = useState({ vehicleOutDate: new Date().toISOString().split('T')[0], vehicleOutTime: new Date().toTimeString().slice(0,5), remarks: '' });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFetch = () => { if (!gateEntryNo) { toast.error('Enter Gate Entry No'); return; } setIsLoaded(true); toast.success('Entry loaded'); };
  const handleSave = () => { toast.success('Vehicle exit recorded!'); };

  return (
    <div className="space-y-6">
      <PageHeader title="Vehicle Exit" subtitle="Record vehicle departure" breadcrumbs={[{ label: 'Vehicle Exit' }]} />
      <FormSection title="Fetch Entry">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Entry Number" value={gateEntryNo} onChange={setGateEntryNo} placeholder="Enter Gate Entry No" required />
          <div className="flex items-end"><Button onClick={handleFetch} className="gap-2 w-full"><Search className="w-4 h-4" />Fetch</Button></div>
        </div>
      </FormSection>
      {isLoaded && (
        <FormSection title="Exit Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField label="Vehicle Out Date" type="date" value={exitData.vehicleOutDate} onChange={(v) => setExitData({...exitData, vehicleOutDate: v})} required />
            <TextField label="Vehicle Out Time" type="time" value={exitData.vehicleOutTime} onChange={(v) => setExitData({...exitData, vehicleOutTime: v})} required />
          </div>
          <div className="mt-4"><Label>Remarks</Label><Textarea value={exitData.remarks} onChange={(e) => setExitData({...exitData, remarks: e.target.value})} placeholder="Enter remarks" className="mt-1.5" /></div>
          <Button onClick={handleSave} className="mt-4 bg-accent text-accent-foreground gap-2"><DoorOpen className="w-4 h-4" />Record Exit</Button>
        </FormSection>
      )}
    </div>
  );
}
