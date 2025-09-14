import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
} from '@/components/ui/dialog';
import { useAllClients, ClientWithRole } from '@/hooks/useClientData';
import { useAdminOrders } from '@/hooks/useOrders';
import { useInvoices } from '@/hooks/useInvoices';
import { useAuth } from '@/contexts/AuthContext';
// Simplification temporaire des types

// Import des composants optimisés
import { ClientStats } from '@/components/admin/users/ClientStats';
import { ClientFilters } from '@/components/admin/users/ClientFilters';
import { ClientTable } from '@/components/admin/users/ClientTable';
import { ClientDetailDialog } from '@/components/admin/users/ClientDetailDialog';

// Import des hooks optimisés
import { useClientFilters } from '@/hooks/useClientFilters';
import { useClientStats } from '@/hooks/useClientStats';
import { useClientActions } from '@/hooks/useClientActions';

const AdminUsers = () => {
  console.log('=== AdminUsers component rendering ===');

  const { user: currentUser, loading: authLoading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log('Auth state:', { currentUser: !!currentUser, authLoading });

  // Récupération des données
  const { data: clients = [], isLoading, error } = useAllClients() as { data: ClientWithRole[], isLoading: boolean, error: Error | null };

  console.log('Clients data:', { clients: clients?.length, isLoading, error: error?.message || error });
  const { data: orders = [] } = useAdminOrders();
  const { data: invoices = [] } = useInvoices();

  // Hooks optimisés
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    filteredClients
  } = useClientFilters({ clients });

  const {
    clientStats,
    getClientOrders,
    getClientTotalSpent
  } = useClientStats({ clients, orders });

  const {
    editingProfile,
    setEditingProfile,
    profileForm,
    setProfileForm,
    selectedUser,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleSelectUser,
    updateClientData,
  } = useClientActions();

  const handleViewClient = (client: ClientWithRole) => {
    handleSelectUser(client);
    setDialogOpen(true);
  };

  // Vérifier l'authentification
  if (authLoading) {
    return <div>Chargement de l'authentification...</div>;
  }

  if (!currentUser) {
    return <div>Vous devez être connecté pour accéder à cette page.</div>;
  }

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des clients" description="Gérez vos clients, leurs commandes et leurs informations">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Gestion des clients" description="Gérez vos clients, leurs commandes et leurs informations">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement des clients. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Gestion des clients"
      description="Gérez vos clients, leurs commandes et leurs informations"
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <ClientStats stats={clientStats} />

        {/* Filters */}
        <ClientFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        {/* Users Table */}
        <ClientTable
          clients={filteredClients}
          getClientTotalSpent={getClientTotalSpent}
          getClientOrders={getClientOrders}
          onViewClient={handleViewClient}
          searchTerm={searchTerm}
        />

        {/* Dialog for client details */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <ClientDetailDialog
            user={selectedUser}
            orders={orders}
            invoices={invoices}
            editingProfile={editingProfile}
            setEditingProfile={setEditingProfile}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            onEditProfile={handleEditProfile}
            onSaveProfile={() => selectedUser ? handleSaveProfile(selectedUser.user_id) : Promise.resolve()}
            onCancelEdit={handleCancelEdit}
            updateClientData={updateClientData}
          />
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;