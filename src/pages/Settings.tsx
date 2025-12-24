import { useState } from 'react';
import { Save, Plus, Trash2, Edit2, Shield, Palette, MessageSquare, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@resl.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Security Guard', email: 'security@resl.com', role: 'Security', status: 'active' },
  { id: '3', name: 'Store Manager', email: 'stores@resl.com', role: 'Stores', status: 'active' },
  { id: '4', name: 'Finance Officer', email: 'finance@resl.com', role: 'Finance', status: 'active' },
  { id: '5', name: 'Viewer User', email: 'viewer@resl.com', role: 'Viewer', status: 'inactive' },
];

const initialRoles: Role[] = [
  { id: '1', name: 'Admin', description: 'Full system access', permissions: ['all'] },
  { id: '2', name: 'Security', description: 'Gate entry and exit operations', permissions: ['inward', 'outward', 'vehicle-exit', 'display', 'print'] },
  { id: '3', name: 'Stores', description: 'Stores management operations', permissions: ['inward', 'outward', 'change', 'display', 'reports'] },
  { id: '4', name: 'Finance', description: 'Reports and analytics access', permissions: ['display', 'reports', 'print'] },
  { id: '5', name: 'Viewer', description: 'Read-only access', permissions: ['display', 'reports'] },
];

const screenPermissions = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'inward', label: 'Inward Gate Entry' },
  { key: 'outward', label: 'Outward Gate Entry' },
  { key: 'change', label: 'Change Entry' },
  { key: 'display', label: 'Display Entry' },
  { key: 'vehicle-exit', label: 'Vehicle Exit' },
  { key: 'cancel', label: 'Cancel Entry' },
  { key: 'print', label: 'Print Entry' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('appearance');
  
  // Theme Settings
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#1e3a5f');
  const [accentColor, setAccentColor] = useState('#14b8a6');
  
  // Welcome Message
  const [welcomeTitle, setWelcomeTitle] = useState('Welcome to RESL Gate Entry System');
  const [welcomeMessage, setWelcomeMessage] = useState('Efficiently manage all your gate operations with seamless SAP integration. Track inward and outward movements in real-time.');
  
  // Users & Roles
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [rolePermissions, setRolePermissions] = useState<string[]>(['all']);
  
  // New User Form
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Viewer' });

  const handleSaveAppearance = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success('Appearance settings saved!');
  };

  const handleSaveWelcome = () => {
    toast.success('Welcome message updated!');
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all fields');
      return;
    }
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Viewer' });
    toast.success('User added successfully!');
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User removed!');
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const handleRoleChange = (roleName: string) => {
    setSelectedRole(roleName);
    const role = roles.find(r => r.name === roleName);
    setRolePermissions(role?.permissions || []);
  };

  const handleTogglePermission = (permission: string) => {
    if (rolePermissions.includes('all')) {
      setRolePermissions([permission]);
    } else if (rolePermissions.includes(permission)) {
      setRolePermissions(rolePermissions.filter(p => p !== permission));
    } else {
      setRolePermissions([...rolePermissions, permission]);
    }
  };

  const handleSavePermissions = () => {
    toast.success(`Permissions for ${selectedRole} role saved!`);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader 
        title="Settings" 
        subtitle="Configure system preferences, users, and roles"
        breadcrumbs={[{ label: 'Settings' }]} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4 hidden sm:block" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="welcome" className="gap-2">
            <MessageSquare className="w-4 h-4 hidden sm:block" />
            Welcome
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4 hidden sm:block" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4 hidden sm:block" />
            Roles
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <FormSection title="Theme & Colors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="flex gap-3">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="flex-1"
                  >
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="flex-1"
                  >
                    Dark
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primary-color"
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-14 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="accent-color"
                    type="color" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-14 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Branding">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-2xl">R</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Current logo</p>
                  <Button variant="outline" size="sm">Upload New Logo</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Login Background</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <div className="w-full h-24 mb-3 rounded-lg bg-gradient-to-r from-primary to-primary/80" />
                  <p className="text-sm text-muted-foreground mb-3">Current background</p>
                  <Button variant="outline" size="sm">Upload New Background</Button>
                </div>
              </div>
            </div>
          </FormSection>

          <Button onClick={handleSaveAppearance} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Save className="w-4 h-4" />
            Save Appearance
          </Button>
        </TabsContent>

        {/* Welcome Message Tab */}
        <TabsContent value="welcome" className="space-y-6">
          <FormSection title="Welcome Message Configuration">
            <div className="space-y-4">
              <TextField
                label="Welcome Title"
                value={welcomeTitle}
                onChange={setWelcomeTitle}
                placeholder="Enter welcome title"
              />
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Enter welcome message"
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Preview">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
              <h3 className="text-lg font-bold mb-1">{welcomeTitle || 'Welcome Title'}</h3>
              <p className="text-primary-foreground/80 text-sm">{welcomeMessage || 'Welcome message will appear here.'}</p>
            </div>
          </FormSection>

          <Button onClick={handleSaveWelcome} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Save className="w-4 h-4" />
            Save Welcome Message
          </Button>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <FormSection title="Add New User">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField
                label="Full Name"
                value={newUser.name}
                onChange={(value) => setNewUser({ ...newUser, name: value })}
                placeholder="Enter name"
              />
              <TextField
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(value) => setNewUser({ ...newUser, email: value })}
                placeholder="Enter email"
              />
              <SelectField
                label="Role"
                value={newUser.role}
                onChange={(value) => setNewUser({ ...newUser, role: value })}
                options={roles.map(r => ({ value: r.name, label: r.name }))}
              />
              <div className="flex items-end">
                <Button onClick={handleAddUser} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </div>
            </div>
          </FormSection>

          <FormSection title="User Management">
            <div className="data-grid">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="w-24 text-center">Status</th>
                    <th className="w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="group">
                      <td className="font-medium">{user.name}</td>
                      <td className="text-muted-foreground">{user.email}</td>
                      <td>
                        <span className="badge-status bg-primary/10 text-primary">{user.role}</span>
                      </td>
                      <td className="text-center">
                        <Switch
                          checked={user.status === 'active'}
                          onCheckedChange={() => handleToggleUserStatus(user.id)}
                        />
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormSection>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <FormSection title="Role Configuration">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <SelectField
                label="Select Role"
                value={selectedRole}
                onChange={handleRoleChange}
                options={roles.map(r => ({ value: r.name, label: r.name }))}
              />
              <div className="md:col-span-3">
                <Label className="mb-2 block">Role Description</Label>
                <p className="text-muted-foreground text-sm mt-2">
                  {roles.find(r => r.name === selectedRole)?.description}
                </p>
              </div>
            </div>
          </FormSection>

          <FormSection title="Screen Permissions">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {screenPermissions.map((screen) => (
                <div 
                  key={screen.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Label htmlFor={screen.key} className="cursor-pointer text-sm">
                    {screen.label}
                  </Label>
                  <Switch
                    id={screen.key}
                    checked={rolePermissions.includes('all') || rolePermissions.includes(screen.key)}
                    onCheckedChange={() => handleTogglePermission(screen.key)}
                    disabled={selectedRole === 'Admin'}
                  />
                </div>
              ))}
            </div>
            {selectedRole === 'Admin' && (
              <p className="text-sm text-muted-foreground mt-4">
                Admin role has full access to all screens and cannot be modified.
              </p>
            )}
          </FormSection>

          <Button onClick={handleSavePermissions} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Save className="w-4 h-4" />
            Save Role Permissions
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
