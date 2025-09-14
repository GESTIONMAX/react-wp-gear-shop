import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import type { Invoice } from './types';

interface InvoicesTabProps {
  userInvoices: Invoice[];
}

export const InvoicesTab: React.FC<InvoicesTabProps> = ({ userInvoices }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  if (userInvoices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Aucune facture pour ce client</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                <TableCell>{new Date(invoice.created_at).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatPrice(invoice.total_amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};