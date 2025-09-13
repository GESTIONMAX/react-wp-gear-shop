import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, UserCheck, ShoppingBag, Euro, Eye, UserX } from 'lucide-react';
import { ClientWithRole } from '@/hooks/useClientData';

interface ClientTableProps {
  clients: ClientWithRole[];
  getClientTotalSpent: (clientId: string) => number;
  getClientOrders: (clientId: string) => any[];
  onViewClient: (client: ClientWithRole) => void;
  searchTerm: string;
}

// Mémorisation du composant ClientRow pour éviter les re-renders
const ClientRow = memo(({
  client,
  totalSpent,
  ordersCount,
  onViewClient
}: {
  client: ClientWithRole;
  totalSpent: number;
  ordersCount: number;
  onViewClient: (client: ClientWithRole) => void;
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {client.first_name?.charAt(0) || client.email?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <p className="font-medium">
              {client.first_name || client.last_name
                ? `${client.first_name || ''} ${client.last_name || ''}`.trim()
                : 'Sans nom'
              }
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>
        <Badge variant={client.role === 'admin' ? 'default' : 'secondary'}>
          {client.role === 'admin' ? (
            <>
              <Crown className="h-3 w-3 mr-1" />
              Admin
            </>
          ) : (
            <>
              <UserCheck className="h-3 w-3 mr-1" />
              Client
            </>
          )}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <span>{ordersCount}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-green-600 font-medium">
          <Euro className="h-4 w-4" />
          <span>{formatPrice(totalSpent)}</span>
        </div>
      </TableCell>
      <TableCell>
        {new Date(client.created_at).toLocaleDateString('fr-FR')}
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewClient(client)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
      </TableCell>
    </TableRow>
  );
});

ClientRow.displayName = 'ClientRow';

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  getClientTotalSpent,
  getClientOrders,
  onViewClient,
  searchTerm,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des clients</CardTitle>
        <CardDescription>
          {clients.length} client{clients.length > 1 ? 's' : ''} trouvé{clients.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Commandes</TableHead>
                <TableHead>Total dépensé</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const totalSpent = getClientTotalSpent(client.id);
                const clientOrders = getClientOrders(client.id);

                return (
                  <ClientRow
                    key={client.id}
                    client={client}
                    totalSpent={totalSpent}
                    ordersCount={clientOrders.length}
                    onViewClient={onViewClient}
                  />
                );
              })}
            </TableBody>
          </Table>

          {clients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun client trouvé</p>
              {searchTerm && (
                <p className="text-sm">Essayez de modifier votre recherche</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};