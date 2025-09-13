import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminOnlyRoute } from '@/components/admin/RoleProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Users,
  Plus,
  Search,
  Crown,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  Settings,
  Trash2
} from 'lucide-react';
import { useInternalUsers, useAssignInternalRole, useUpdateInternalUserRole, useRevokeInternalAccess } from '@/hooks/useInternalUsers';
import { UserRole } from '@/hooks/useAdmin';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminInternalUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('staff');

  const { data: internalUsers, isLoading } = useInternalUsers();
  const { mutate: assignRole, isPending: isAssigning } = useAssignInternalRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateInternalUserRole();
  const { mutate: revokeAccess, isPending: isRevoking } = useRevokeInternalAccess();

  const handleAddInternalUser = () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse email.",
        variant: "destructive",
      });
      return;
    }

    assignRole({
      userEmail: newUserEmail.trim(),
      role: newUserRole as Exclude<UserRole, 'client'>
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setNewUserEmail('');
        setNewUserRole('staff');
      }
    });
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    if (newRole === 'client') {
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer le rôle 'client' à un utilisateur interne.",
        variant: "destructive",
      });
      return;
    }

    updateRole({
      userId,
      role: newRole as Exclude<UserRole, 'client'>
    });
  };

  const handleRevokeAccess = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir révoquer l\'accès interne de cet utilisateur ?')) {
      revokeAccess(userId);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: { label: 'Administrateur', variant: 'destructive' as const, icon: Crown },
      staff: { label: 'Personnel', variant: 'default' as const, icon: UserCheck },
      employee: { label: 'Employé', variant: 'secondary' as const, icon: Users },
      client: { label: 'Client', variant: 'outline' as const, icon: UserX }
    };

    const config = roleConfig[role] || roleConfig.employee;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredUsers = internalUsers?.filter(user => {
    const matchesSearch = !searchTerm ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  }) || [];

  return (
    <AdminOnlyRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Personnel Interne</h1>
              <p className="text-muted-foreground">
                Gérez les utilisateurs internes (admin, staff, employés)
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter un utilisateur interne
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur interne</DialogTitle>
                  <DialogDescription>
                    Invitez un nouvel utilisateur à rejoindre l'équipe interne.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="utilisateur@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="staff">Personnel</SelectItem>
                        <SelectItem value="employee">Employé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddInternalUser}
                    disabled={isAssigning}
                    className="w-full"
                  >
                    {isAssigning ? 'Ajout en cours...' : 'Ajouter l\'utilisateur'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Filtres et recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Administrateurs</SelectItem>
                    <SelectItem value="staff">Personnel</SelectItem>
                    <SelectItem value="employee">Employés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interne</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{internalUsers?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {internalUsers?.filter(u => u.role === 'admin').length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Personnel</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {internalUsers?.filter(u => u.role === 'staff').length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {internalUsers?.filter(u => u.role === 'employee').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs internes ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Liste des membres de l'équipe interne avec leurs rôles et permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : filteredUsers.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Aucun utilisateur interne trouvé avec les critères actuels.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Ajouté</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {user.user_id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {user.email || 'Non renseigné'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDistanceToNow(new Date(user.created_at), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(newRole) => handleUpdateRole(user.user_id, newRole as UserRole)}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="employee">Employé</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAccess(user.user_id)}
                              disabled={isRevoking}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminOnlyRoute>
  );
};

export default AdminInternalUsers;