import { useState } from 'react';
import { useInvoices, useUpdateInvoiceStatus } from '@/hooks/useInvoices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  FileText, 
  Euro, 
  Calendar, 
  Download,
  Eye,
  Edit,
  Filter
} from 'lucide-react';
import { Invoice } from '@/types/invoice';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminInvoices = () => {
  const { data: invoices = [], isLoading } = useInvoices();
  const updateInvoiceStatus = useUpdateInvoiceStatus();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtrer les factures
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (invoice.notes && invoice.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistiques
  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    cancelled: invoices.filter(i => i.status === 'cancelled').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.total_amount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0)
  };

  const formatPrice = (price: number, currency: string = 'EUR') => {
    return `${(price / 100).toFixed(2)} ${currency === 'EUR' ? '€' : currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500 text-gray-50';
      case 'sent':
        return 'bg-blue-500 text-blue-50';
      case 'paid':
        return 'bg-green-500 text-green-50';
      case 'cancelled':
        return 'bg-red-500 text-red-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'sent':
        return 'Envoyée';
      case 'paid':
        return 'Payée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const handleStatusUpdate = (invoiceId: string, status: Invoice['status']) => {
    updateInvoiceStatus.mutate({ invoiceId, status });
  };

  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Factures</h1>
            <p className="text-muted-foreground">
              Gérez toutes les factures de votre boutique
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Factures Payées</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paid}</div>
              <p className="text-xs text-muted-foreground">
                {formatPrice(stats.paidAmount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro de facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des factures */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Factures</CardTitle>
            <CardDescription>
              {filteredInvoices.length} facture(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                      <TableCell>{formatDate(invoice.due_date)}</TableCell>
                      <TableCell>{formatPrice(invoice.total_amount, invoice.currency)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewInvoiceDetails(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.pdf_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(invoice.pdf_url, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Select
                            value={invoice.status}
                            onValueChange={(status) => handleStatusUpdate(invoice.id, status as Invoice['status'])}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Brouillon</SelectItem>
                              <SelectItem value="sent">Envoyée</SelectItem>
                              <SelectItem value="paid">Payée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune facture trouvée
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de détails de facture */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la facture</DialogTitle>
              <DialogDescription>
                {selectedInvoice?.invoice_number}
              </DialogDescription>
            </DialogHeader>
            
            {selectedInvoice && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Numéro de facture</Label>
                    <p className="text-sm text-muted-foreground">{selectedInvoice.invoice_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Statut</Label>
                    <Badge className={getStatusColor(selectedInvoice.status)}>
                      {getStatusLabel(selectedInvoice.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date d'émission</Label>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedInvoice.invoice_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date d'échéance</Label>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedInvoice.due_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Montant total</Label>
                    <p className="text-sm font-semibold">{formatPrice(selectedInvoice.total_amount, selectedInvoice.currency)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Devise</Label>
                    <p className="text-sm text-muted-foreground">{selectedInvoice.currency}</p>
                  </div>
                </div>

                {selectedInvoice.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedInvoice.notes}</p>
                  </div>
                )}

                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Articles</Label>
                    <div className="mt-2 space-y-2">
                      {selectedInvoice.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantité: {item.quantity} × {formatPrice(item.unit_price, selectedInvoice.currency)}
                            </p>
                          </div>
                          <p className="font-semibold">{formatPrice(item.total_price, selectedInvoice.currency)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {selectedInvoice.pdf_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedInvoice.pdf_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  )}
                  <Button onClick={() => setIsDetailsOpen(false)}>
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;