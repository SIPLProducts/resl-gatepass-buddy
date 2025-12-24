import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { SelectField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Settings() {
  const [theme, setTheme] = useState('light');

  const handleSave = () => { toast.success('Settings saved!'); };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Settings" subtitle="Configure system preferences" breadcrumbs={[{ label: 'Settings' }]} />
      
      <FormSection title="Theme & Appearance">
        <SelectField label="Theme" value={theme} onChange={setTheme} options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]} />
      </FormSection>

      <FormSection title="User Management">
        <p className="text-muted-foreground text-sm">Role-based access control for Admin, Security, Stores, Finance, and Viewer roles.</p>
      </FormSection>

      <Button onClick={handleSave} className="bg-accent text-accent-foreground">Save Settings</Button>
    </div>
  );
}
