import { useState } from 'react';
import { User, Mail, Phone, Camera, Save } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@resl.com',
    phone: '+91 98765 43210',
    designation: 'System Administrator',
    department: 'IT',
    employeeId: 'EMP001',
  });

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings and preferences"
        breadcrumbs={[{ label: 'Profile' }]}
      />

      <div className="grid gap-6">
        {/* Profile Picture Section */}
        <FormSection title="Profile Picture">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  AU
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{profile.firstName} {profile.lastName}</h3>
              <p className="text-sm text-muted-foreground">{profile.designation}</p>
              <p className="text-sm text-muted-foreground">{profile.department} Department</p>
            </div>
          </div>
        </FormSection>

        {/* Personal Information */}
        <FormSection title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="First Name"
              value={profile.firstName}
              onChange={(value) => setProfile({ ...profile, firstName: value })}
              required
            />
            <TextField
              label="Last Name"
              value={profile.lastName}
              onChange={(value) => setProfile({ ...profile, lastName: value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={profile.email}
              onChange={(value) => setProfile({ ...profile, email: value })}
              required
            />
            <TextField
              label="Phone Number"
              value={profile.phone}
              onChange={(value) => setProfile({ ...profile, phone: value })}
            />
          </div>
        </FormSection>

        {/* Work Information */}
        <FormSection title="Work Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Employee ID"
              value={profile.employeeId}
              readOnly
            />
            <TextField
              label="Designation"
              value={profile.designation}
              readOnly
            />
            <TextField
              label="Department"
              value={profile.department}
              readOnly
            />
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
