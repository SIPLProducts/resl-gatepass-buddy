import { useState } from 'react';
import { Search, Save, FileDown } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ChangeEntry() {
  const [gateEntryNo, setGateEntryNo] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFetch = () => {
    if (!gateEntryNo) {
      toast.error('Please enter Gate Entry Number');
      return;
    }
    setIsLoaded(true);
    toast.success('Gate Entry loaded for modification');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Change Gate Entry" subtitle="Modify existing gate entry records" breadcrumbs={[{ label: 'Change' }]} />
      
      <FormSection title="Fetch Gate Entry">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField label="Gate Entry Number" value={gateEntryNo} onChange={setGateEntryNo} placeholder="Enter Gate Entry No" required />
          <div className="flex items-end">
            <Button onClick={handleFetch} className="gap-2 w-full"><Search className="w-4 h-4" />Fetch Entry</Button>
          </div>
        </div>
      </FormSection>

      {!isLoaded ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileDown className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Enter Gate Entry Number and click "Fetch Entry" to load data for modification</p>
        </div>
      ) : (
        <FormSection title="Entry Details">
          <p className="text-muted-foreground">Entry data loaded. Modify fields and save.</p>
          <Button className="mt-4 bg-accent text-accent-foreground gap-2"><Save className="w-4 h-4" />Save Changes</Button>
        </FormSection>
      )}
    </div>
  );
}
