import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ShoppingCart, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  CreditCard, 
  User, 
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  X,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  useAdminOrders, 
  useAdminOrder,
  useUpdateOrderStatus, 
  useUpdatePaymentStatus,
  useUpdateOrderNotes,
  useDeleteOrder,
  formatPrice,
  getStatusColor,
  getPaymentStatusColor
} from '@/hooks/useOrders';
import { Order } from '@/types/order';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminOrders: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');

  const { data: orders, isLoading, error } = useAdminOrders();
  const { data: selectedOrder } = useAdminOrder(selectedOrderId || '');
  
  const updateOrderStatus = useUpdateOrderStatus();
  const updatePaymentStatus = useUpdatePaymentStatus();
  const updateOrderNotes = useUpdateOrderNotes();
  const deleteOrder = useDeleteOrder();

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus.mutate({ orderId, status });
  };

  const handlePaymentStatusChange = (orderId: string, paymentStatus: Order['payment_status']) => {
    updatePaymentStatus.mutate({ orderId, paymentStatus });
  };

  const handleSaveNotes = () => {
    if (selectedOrderId) {
      updateOrderNotes.mutate({ 
        orderId: selectedOrderId, 
        notes: editingNotes 
      });
    }
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la commande ${orderNumber} ?`)) {
      deleteOrder.mutate(orderId);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des Commandes" description="Suivez et gérez toutes vos commandes">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Gestion des Commandes" description="Suivez et gérez toutes vos commandes">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Erreur lors du chargement des commandes</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  const paidOrders = orders?.filter(o => o.payment_status === 'paid').length || 0;

  return (
    <AdminLayout 
      title="Gestion des Commandes" 
      description="Suivez et gérez toutes vos commandes"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Commandes</h1>
          <p className="text-muted-foreground">
            Gérez le cycle de vie complet de vos commandes
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Commandes créées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                À traiter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Revenus totaux
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes Payées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidOrders}</div>
              <p className="text-xs text-muted-foreground">
                Paiements confirmés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des commandes */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les Commandes</CardTitle>
            <CardDescription>
              Vue d'ensemble de toutes vos commandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-md flex items-center justify-center">
                            <ShoppingCart className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{order.order_number}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.order_items?.length || 0} article(s)
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {order.profiles?.first_name} {order.profiles?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.profiles?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-lg">
                          {formatPrice(order.total_amount, order.currency)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="shipped">Expédiée</SelectItem>
                            <SelectItem value="delivered">Livrée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.payment_status}
                          onValueChange={(value) => handlePaymentStatusChange(order.id, value as Order['payment_status'])}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={getPaymentStatusColor(order.payment_status)}>
                              {order.payment_status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="paid">Payé</SelectItem>
                            <SelectItem value="failed">Échoué</SelectItem>
                            <SelectItem value="refunded">Remboursé</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteOrder(order.id, order.order_number)}
                            disabled={deleteOrder.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                <p className="text-muted-foreground mb-4">
                  Les commandes apparaîtront ici une fois que vos clients commenceront à acheter.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de détail de commande */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Détails de la commande {selectedOrder?.order_number}
              </DialogTitle>
              <DialogDescription>
                Informations complètes sur cette commande
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Informations client */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Informations Client</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Nom:</strong> {selectedOrder.profiles?.first_name} {selectedOrder.profiles?.last_name}</p>
                    <p><strong>Email:</strong> {selectedOrder.profiles?.email}</p>
                    {selectedOrder.profiles && 'phone' in selectedOrder.profiles && (
                      <p><strong>Téléphone:</strong> {(selectedOrder.profiles as any).phone || 'Non renseigné'}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Adresses */}
                {(selectedOrder.billing_address || selectedOrder.shipping_address) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5" />
                        <span>Adresses</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      {selectedOrder.billing_address && (
                        <div>
                          <h4 className="font-semibold mb-2">Adresse de facturation</h4>
                          <pre className="text-sm">{JSON.stringify(selectedOrder.billing_address, null, 2)}</pre>
                        </div>
                      )}
                      {selectedOrder.shipping_address && (
                        <div>
                          <h4 className="font-semibold mb-2">Adresse de livraison</h4>
                          <pre className="text-sm">{JSON.stringify(selectedOrder.shipping_address, null, 2)}</pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Articles commandés */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Articles commandés</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Variante</TableHead>
                          <TableHead>Quantité</TableHead>
                          <TableHead>Prix unitaire</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.order_items?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.product_name}</TableCell>
                            <TableCell>{item.variant_name || '-'}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{formatPrice(item.unit_price)}</TableCell>
                            <TableCell className="font-bold">{formatPrice(item.total_price)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total de la commande:</span>
                        <span>{formatPrice(selectedOrder.total_amount, selectedOrder.currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Notes internes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Notes sur cette commande</Label>
                      <Textarea
                        id="notes"
                        placeholder="Ajoutez vos notes internes sur cette commande..."
                        value={editingNotes || selectedOrder.notes || ''}
                        onChange={(e) => setEditingNotes(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSaveNotes}>
                      Sauvegarder les notes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;