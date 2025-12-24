import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const faqs = [
  { q: 'How do I create a new gate entry?', a: 'Navigate to Inward or Outward module and select the appropriate sub-module.' },
  { q: 'How to cancel an entry?', a: 'Go to Cancel module, enter the Gate Entry Number, provide reason and confirm.' },
  { q: 'Can I modify an existing entry?', a: 'Yes, use the Change module to fetch and modify entries.' },
];

export default function HelpSupport() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" subtitle="Get help with the Gate Entry System" breadcrumbs={[{ label: 'Help & Support' }]} />
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="enterprise-card p-6 text-center"><Mail className="w-8 h-8 mx-auto mb-3 text-accent" /><h3 className="font-semibold mb-1">Email Support</h3><p className="text-sm text-muted-foreground">support@sharviinfotech.com</p></div>
        <div className="enterprise-card p-6 text-center"><Phone className="w-8 h-8 mx-auto mb-3 text-accent" /><h3 className="font-semibold mb-1">Phone Support</h3><p className="text-sm text-muted-foreground">+91 22 1234 5678</p></div>
        <div className="enterprise-card p-6 text-center"><MessageSquare className="w-8 h-8 mx-auto mb-3 text-accent" /><h3 className="font-semibold mb-1">Raise Ticket</h3><p className="text-sm text-muted-foreground">Submit a support ticket</p></div>
      </div>

      <FormSection title="Frequently Asked Questions">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">{faq.q}</h4>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}
