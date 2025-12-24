import { useState } from 'react';
import { Search, Printer } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PrintEntry() {
  const [gateEntryNo, setGateEntryNo] = useState('');
  const [printFormat, setPrintFormat] = useState('');
  const [copies, setCopies] = useState('1');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFetch = () => { if (!gateEntryNo) { toast.error('Enter Gate Entry No'); return; } setIsLoaded(true); };
  const handlePrint = () => { toast.success('Printing initiated!'); };

  return (
    <div className="space-y-6">
      <PageHeader title="Print Gate Entry" subtitle="Generate and print documents" breadcrumbs={[{ label: 'Print' }]} />
      <FormSection title="Fetch Entry">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Entry Number" value={gateEntryNo} onChange={setGateEntryNo} placeholder="Enter Gate Entry No" required />
          <div className="flex items-end"><Button onClick={handleFetch} className="gap-2 w-full"><Search className="w-4 h-4" />Fetch</Button></div>
        </div>
      </FormSection>
      {isLoaded && (
        <FormSection title="Print Options">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Print Format" value={printFormat} onChange={setPrintFormat} options={[{value:'standard',label:'Standard Format'},{value:'detailed',label:'Detailed Format'},{value:'summary',label:'Summary Format'}]} required />
            <TextField label="Number of Copies" type="number" value={copies} onChange={setCopies} />
            <TextField label="Printed By" value="Admin User" readOnly />
          </div>
          <Button onClick={handlePrint} className="mt-4 bg-accent text-accent-foreground gap-2"><Printer className="w-4 h-4" />Print</Button>
        </FormSection>
      )}
    </div>
  );
}
