import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from './ProfileTab';
import { AddressesTab } from './AddressesTab';
import { OrdersTab } from './OrdersTab';
import { InvoicesTab } from './InvoicesTab';
import { StatsTab } from './StatsTab';
import { ClientWithRole } from '@/hooks/useClientData';

interface ClientDetailDialogProps {
  user: ClientWithRole | null;
  orders: any[];
  invoices: any[];
  editingProfile: boolean;
  setEditingProfile: (editing: boolean) => void;
  profileForm: any;
  setProfileForm: (form: any) => void;
  onEditProfile: (clientData: any) => void;
  onSaveProfile: (userId: string) => Promise<void>;
  onCancelEdit: () => void;
  updateClientData: any;
}

export const ClientDetailDialog: React.FC<ClientDetailDialogProps> = ({
  user,
  orders,
  invoices,
  editingProfile,
  setEditingProfile,
  profileForm,
  setProfileForm,
  onEditProfile,
  onSaveProfile,
  onCancelEdit,
  updateClientData,
}) => {
  if (!user) return null;

  const userOrders = orders.filter(order => order.user_id === user.user_id);
  const userInvoices = invoices.filter(invoice => invoice.user_id === user.user_id);

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-medium text-primary">
              {user.first_name?.charAt(0) || user.email?.charAt(0) || '?'}
            </span>
          </div>
          {user.first_name || user.last_name
            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
            : 'Client sans nom'
          }
        </DialogTitle>
        <DialogDescription>
          Informations détaillées et historique du client
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="addresses">Adresses</TabsTrigger>
          <TabsTrigger value="orders">Commandes ({userOrders.length})</TabsTrigger>
          <TabsTrigger value="invoices">Factures ({userInvoices.length})</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab user={user} />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressesTab
            user={user}
            userOrders={userOrders}
            editingProfile={editingProfile}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            onEditProfile={onEditProfile}
            onSaveProfile={onSaveProfile}
            onCancelEdit={onCancelEdit}
            updateClientData={updateClientData}
          />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab userOrders={userOrders} />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesTab userInvoices={userInvoices} />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab userOrders={userOrders} userInvoices={userInvoices} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};