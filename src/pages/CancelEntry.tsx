import { useState } from 'react';
import { Search, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField } from '@/components/shared/FormField';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CancelEntry() {
  const [gateEntryNo, setGateEntryNo] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFetch = () => { if (!gateEntryNo) { toast.error('Enter Gate Entry No'); return; } setIsLoaded(true); };
  const handleCancel = () => { if (!cancelReason || !confirmed) { toast.error('Complete all fields'); return; } toast.success('Gate Entry cancelled!'); };

  return (
    <div className="space-y-6">
      <PageHeader title="Cancel Gate Entry" subtitle="Cancel existing gate entries" breadcrumbs={[{ label: 'Cancel' }]} />
      <FormSection title="Fetch Entry">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Entry Number" value={gateEntryNo} onChange={setGateEntryNo} placeholder="Enter Gate Entry No" required />
          <div className="flex items-end"><Button onClick={handleFetch} className="gap-2 w-full"><Search className="w-4 h-4" />Fetch</Button></div>
        </div>
      </FormSection>
      {isLoaded && (
        <FormSection title="Cancel Details">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <TextField label="Cancelled By" value="Admin User" readOnly />
            <TextField label="Cancelled Date" value={new Date().toLocaleDateString()} readOnly />
          </div>
          <div className="mb-4"><Label>Cancel Reason <span className="text-destructive">*</span></Label><Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Enter reason for cancellation" className="mt-1.5" /></div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox id="confirm" checked={confirmed} onCheckedChange={(c) => setConfirmed(c as boolean)} />
            <Label htmlFor="confirm" className="cursor-pointer">I confirm this cancellation action</Label>
          </div>
          <Button onClick={handleCancel} disabled={!confirmed || !cancelReason} variant="destructive" className="gap-2"><XCircle className="w-4 h-4" />Cancel Entry</Button>
        </FormSection>
      )}
    </div>
  );
}
