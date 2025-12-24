import { useState } from 'react';
import { Search, Eye, FileDown } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DisplayEntry() {
  const [gateEntryNo, setGateEntryNo] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFetch = () => {
    if (!gateEntryNo) { toast.error('Please enter Gate Entry Number'); return; }
    setIsLoaded(true);
    toast.success('Gate Entry displayed');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Display Gate Entry" subtitle="View gate entry details (read-only)" breadcrumbs={[{ label: 'Display' }]} />
      
      <FormSection title="Search Gate Entry">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Entry Number" value={gateEntryNo} onChange={setGateEntryNo} placeholder="Enter Gate Entry No" required />
          <div className="flex items-end"><Button onClick={handleFetch} className="gap-2 w-full"><Search className="w-4 h-4" />Display</Button></div>
        </div>
      </FormSection>

      {!isLoaded ? (
        <div className="text-center py-16 text-muted-foreground"><FileDown className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Enter Gate Entry Number to view details</p></div>
      ) : (
        <FormSection title="Entry Details (Read-Only)">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TextField label="Gate Entry No" value="GE-2024-001" readOnly />
            <TextField label="Type" value="Inward - PO Reference" readOnly />
            <TextField label="Vehicle No" value="MH-12-AB-1234" readOnly />
            <TextField label="Vendor" value="ABC Suppliers" readOnly />
          </div>
        </FormSection>
      )}
    </div>
  );
}
