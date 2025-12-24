import { useState } from 'react';
import { Save, Plus, Trash2, Edit2, Shield, Palette, MessageSquare, Users, Check, X } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormSection } from '@/components/shared/FormSection';
import { TextField, SelectField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface User {
  id: string;
  plant: string;
  userId: string;
  fullName: string;
  emailId: string;
  contactNumber: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface Role {
  id: string;
  roleName: string;
  roleDescription: string;
  permissions: string[];
}

// All sidebar screen permissions
const allScreenPermissions = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'inward-po', label: 'Inward - With Reference PO' },
  { key: 'inward-subcontracting', label: 'Inward - Subcontracting' },
  { key: 'inward-without-ref', label: 'Inward - Without Reference' },
  { key: 'outward-billing', label: 'Outward - Billing Reference' },
  { key: 'outward-non-returnable', label: 'Outward - Non-Returnable' },
  { key: 'outward-returnable', label: 'Outward - Returnable' },
  { key: 'change', label: 'Change Entry' },
  { key: 'display', label: 'Display Entry' },
  { key: 'exit', label: 'Vehicle Exit' },
  { key: 'cancel', label: 'Cancel Entry' },
  { key: 'print', label: 'Print Entry' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
  { key: 'help', label: 'Help & Support' },
];

const plantOptions = [
  { value: 'P001', label: 'P001 - Mumbai Plant' },
  { value: 'P002', label: 'P002 - Delhi Plant' },
  { value: 'P003', label: 'P003 - Chennai Plant' },
  { value: 'P004', label: 'P004 - Bangalore Plant' },
];

const initialUsers: User[] = [
  { id: '1', plant: 'P001', userId: 'USR001', fullName: 'Rajesh Kumar', emailId: 'rajesh.kumar@resl.com', contactNumber: '9876543210', role: 'Admin', status: 'Active' },
  { id: '2', plant: 'P001', userId: 'USR002', fullName: 'Priya Sharma', emailId: 'priya.sharma@resl.com', contactNumber: '9876543211', role: 'Security', status: 'Active' },
  { id: '3', plant: 'P002', userId: 'USR003', fullName: 'Amit Patel', emailId: 'amit.patel@resl.com', contactNumber: '9876543212', role: 'Stores', status: 'Active' },
  { id: '4', plant: 'P002', userId: 'USR004', fullName: 'Neha Singh', emailId: 'neha.singh@resl.com', contactNumber: '9876543213', role: 'Finance', status: 'Active' },
  { id: '5', plant: 'P003', userId: 'USR005', fullName: 'Vijay Verma', emailId: 'vijay.verma@resl.com', contactNumber: '9876543214', role: 'Viewer', status: 'Inactive' },
];

const initialRoles: Role[] = [
  { id: '1', roleName: 'Admin', roleDescription: 'Full system access with all permissions. Can manage users, roles, and system settings.', permissions: allScreenPermissions.map(p => p.key) },
  { id: '2', roleName: 'Security', roleDescription: 'Gate security operations for inward and outward entries.', permissions: ['dashboard', 'inward-po', 'inward-subcontracting', 'inward-without-ref', 'outward-billing', 'outward-non-returnable', 'outward-returnable', 'exit', 'display', 'print'] },
  { id: '3', roleName: 'Stores', roleDescription: 'Stores management operations including inventory and material handling.', permissions: ['dashboard', 'inward-po', 'inward-subcontracting', 'change', 'display', 'reports'] },
  { id: '4', roleName: 'Finance', roleDescription: 'Reports, analytics, and financial data access only.', permissions: ['dashboard', 'display', 'reports', 'print'] },
  { id: '5', roleName: 'Viewer', roleDescription: 'Read-only access to view entries and reports.', permissions: ['dashboard', 'display', 'reports'] },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('users');
  
  // Theme Settings
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#1e3a5f');
  const [accentColor, setAccentColor] = useState('#14b8a6');
  
  // Welcome Message
  const [welcomeTitle, setWelcomeTitle] = useState('Welcome to RESL Gate Entry System');
  const [welcomeMessage, setWelcomeMessage] = useState('Efficiently manage all your gate operations with seamless SAP integration. Track inward and outward movements in real-time.');
  
  // Users & Roles
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  
  // User Dialog
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    plant: '',
    userId: '',
    fullName: '',
    emailId: '',
    contactNumber: '',
    role: 'Viewer',
  });

  // Role Dialog
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({
    roleName: '',
    roleDescription: '',
    permissions: [] as string[],
  });

  // Permissions Dialog
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<Role | null>(null);
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);

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

  // User handlers
  const openAddUserDialog = () => {
    setEditingUser(null);
    setUserForm({
      plant: '',
      userId: `USR${String(users.length + 1).padStart(3, '0')}`,
      fullName: '',
      emailId: '',
      contactNumber: '',
      role: 'Viewer',
    });
    setIsUserDialogOpen(true);
  };

  const openEditUserDialog = (user: User) => {
    setEditingUser(user);
    setUserForm({
      plant: user.plant,
      userId: user.userId,
      fullName: user.fullName,
      emailId: user.emailId,
      contactNumber: user.contactNumber,
      role: user.role,
    });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!userForm.plant || !userForm.fullName || !userForm.emailId || !userForm.contactNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
      toast.success('User updated successfully!');
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...userForm,
        status: 'Active',
      };
      setUsers([...users, newUser]);
      toast.success('User added successfully!');
    }
    setIsUserDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User removed!');
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
  };

  // Role handlers
  const openAddRoleDialog = () => {
    setEditingRole(null);
    setRoleForm({
      roleName: '',
      roleDescription: '',
      permissions: [],
    });
    setIsRoleDialogOpen(true);
  };

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      roleName: role.roleName,
      roleDescription: role.roleDescription,
      permissions: role.permissions,
    });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!roleForm.roleName || !roleForm.roleDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...roleForm } : r));
      toast.success('Role updated successfully!');
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...roleForm,
      };
      setRoles([...roles, newRole]);
      toast.success('Role added successfully!');
    }
    setIsRoleDialogOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    const roleToDelete = roles.find(r => r.id === id);
    if (roleToDelete?.roleName === 'Admin') {
      toast.error('Cannot delete Admin role');
      return;
    }
    setRoles(roles.filter(r => r.id !== id));
    toast.success('Role removed!');
  };

  // Permissions handlers
  const openPermissionsDialog = (role: Role) => {
    setSelectedRoleForPermissions(role);
    setTempPermissions([...role.permissions]);
    setIsPermissionsDialogOpen(true);
  };

  const togglePermission = (permKey: string) => {
    setTempPermissions(prev => 
      prev.includes(permKey) 
        ? prev.filter(p => p !== permKey)
        : [...prev, permKey]
    );
  };

  const handleSavePermissions = () => {
    if (selectedRoleForPermissions) {
      setRoles(roles.map(r => 
        r.id === selectedRoleForPermissions.id 
          ? { ...r, permissions: tempPermissions }
          : r
      ));
      toast.success(`Permissions for ${selectedRoleForPermissions.roleName} saved!`);
    }
    setIsPermissionsDialogOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader 
        title="Settings" 
        subtitle="Configure system preferences, users, and roles"
        breadcrumbs={[{ label: 'Settings' }]} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4 hidden sm:block" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4 hidden sm:block" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4 hidden sm:block" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="welcome" className="gap-2">
            <MessageSquare className="w-4 h-4 hidden sm:block" />
            Welcome
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <FormSection 
            title="User Management" 
            actions={
              <Button onClick={openAddUserDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            }
          >
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Plant</TableHead>
                    <TableHead className="font-semibold">User Id</TableHead>
                    <TableHead className="font-semibold">Full Name</TableHead>
                    <TableHead className="font-semibold">Email Id</TableHead>
                    <TableHead className="font-semibold">Contact Number</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{user.plant}</TableCell>
                      <TableCell className="font-mono text-sm">{user.userId}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{user.emailId}</TableCell>
                      <TableCell>{user.contactNumber}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={user.status === 'Active'}
                          onCheckedChange={() => handleToggleUserStatus(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => openEditUserDialog(user)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </FormSection>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <FormSection 
            title="Role Management"
            actions={
              <Button onClick={openAddRoleDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Role
              </Button>
            }
          >
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-[180px]">Role Name</TableHead>
                    <TableHead className="font-semibold">Role Description</TableHead>
                    <TableHead className="font-semibold w-[200px] text-center">Screen Permissions</TableHead>
                    <TableHead className="font-semibold w-[100px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-muted/30">
                      <TableCell>
                        <Badge variant="outline" className="font-medium text-sm px-3 py-1">
                          {role.roleName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{role.roleDescription}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openPermissionsDialog(role)}
                          className="gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Manage ({role.permissions.length})
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => openEditRoleDialog(role)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={role.roleName === 'Admin'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </FormSection>
        </TabsContent>

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
      </Tabs>

      {/* Add/Edit User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <SelectField
              label="Plant"
              value={userForm.plant}
              onChange={(value) => setUserForm({ ...userForm, plant: value })}
              options={plantOptions}
              placeholder="Select plant"
              required
            />
            <TextField
              label="User ID"
              value={userForm.userId}
              onChange={(value) => setUserForm({ ...userForm, userId: value })}
              placeholder="User ID"
              disabled
            />
            <TextField
              label="Full Name"
              value={userForm.fullName}
              onChange={(value) => setUserForm({ ...userForm, fullName: value })}
              placeholder="Enter full name"
              required
            />
            <TextField
              label="Email ID"
              type="email"
              value={userForm.emailId}
              onChange={(value) => setUserForm({ ...userForm, emailId: value })}
              placeholder="Enter email"
              required
            />
            <TextField
              label="Contact Number"
              value={userForm.contactNumber}
              onChange={(value) => setUserForm({ ...userForm, contactNumber: value })}
              placeholder="Enter contact number"
              required
            />
            <SelectField
              label="Role"
              value={userForm.role}
              onChange={(value) => setUserForm({ ...userForm, role: value })}
              options={roles.map(r => ({ value: r.roleName, label: r.roleName }))}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser} className="gap-2">
              <Save className="w-4 h-4" />
              {editingUser ? 'Update User' : 'Add User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <TextField
              label="Role Name"
              value={roleForm.roleName}
              onChange={(value) => setRoleForm({ ...roleForm, roleName: value })}
              placeholder="Enter role name"
              required
            />
            <div className="space-y-2">
              <Label>Role Description</Label>
              <Textarea
                value={roleForm.roleDescription}
                onChange={(e) => setRoleForm({ ...roleForm, roleDescription: e.target.value })}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} className="gap-2">
              <Save className="w-4 h-4" />
              {editingRole ? 'Update Role' : 'Add Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Screen Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Screen Permissions - {selectedRoleForPermissions?.roleName}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Assign or unassign screen access for this role. Toggle each screen to enable or disable access.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
              {allScreenPermissions.map((screen) => {
                const isAssigned = tempPermissions.includes(screen.key);
                return (
                  <div 
                    key={screen.key}
                    onClick={() => selectedRoleForPermissions?.roleName !== 'Admin' && togglePermission(screen.key)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isAssigned 
                        ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                        : 'border-border hover:bg-muted/50'
                    } ${selectedRoleForPermissions?.roleName === 'Admin' ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span className={`text-sm font-medium ${isAssigned ? 'text-primary' : 'text-foreground'}`}>
                      {screen.label}
                    </span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isAssigned 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isAssigned ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedRoleForPermissions?.roleName === 'Admin' && (
              <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                ⚠️ Admin role has full access to all screens and cannot be modified.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSavePermissions} 
              className="gap-2"
              disabled={selectedRoleForPermissions?.roleName === 'Admin'}
            >
              <Save className="w-4 h-4" />
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
