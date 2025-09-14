import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, X, Truck, Phone } from 'lucide-react';
import { ClientWithRole } from '@/hooks/useClientData';
import type { Order, ProfileFormData, UpdateClientData } from './types';

interface AddressesTabProps {
  user: ClientWithRole;
  userOrders: Order[];
  editingProfile: boolean;
  profileForm: ProfileFormData;
  setProfileForm: (form: ProfileFormData) => void;
  onEditProfile: (clientData: ClientWithRole) => void;
  onSaveProfile: (userId: string) => Promise<void>;
  onCancelEdit: () => void;
  updateClientData: UpdateClientData;
}

export const AddressesTab: React.FC<AddressesTabProps> = ({
  user,
  userOrders,
  editingProfile,
  profileForm,
  setProfileForm,
  onEditProfile,
  onSaveProfile,
  onCancelEdit,
  updateClientData,
}) => {
  const clientData = user;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Informations du client</h3>
          <p className="text-sm text-muted-foreground">
            Adresse par défaut et informations de contact marketing
          </p>
        </div>
        {!editingProfile ? (
          <Button
            onClick={() => onEditProfile(clientData)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => onSaveProfile(user.user_id)}
              size="sm"
              disabled={updateClientData.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateClientData.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            <Button onClick={onCancelEdit} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        )}
      </div>

      {!editingProfile ? (
        // Mode affichage
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Adresse par défaut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">
                  {clientData?.first_name} {clientData?.last_name}
                </div>
                {clientData?.address && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>{clientData.address}</div>
                    {clientData.address_complement && (
                      <div>{clientData.address_complement}</div>
                    )}
                    <div>{clientData.postal_code} {clientData.city}</div>
                    <div>{clientData.country}</div>
                  </div>
                )}
                {!clientData?.address && (
                  <div className="text-sm text-muted-foreground italic">
                    Aucune adresse par défaut définie
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Marketing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Téléphone SMS:</span>
                  <span className="text-sm">
                    {clientData?.marketing_phone || 'Non renseigné'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Consentement SMS:</span>
                  <Badge variant={clientData?.marketing_consent ? 'default' : 'secondary'}>
                    {clientData?.marketing_consent ? 'Accepté' : 'Refusé'}
                  </Badge>
                </div>
                {clientData?.notes && (
                  <div className="mt-4">
                    <span className="text-sm font-medium">Notes internes:</span>
                    <div className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                      {clientData.notes}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Mode édition
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={profileForm.first_name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    value={profileForm.last_name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="principal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="principal">Adresse principale</TabsTrigger>
              <TabsTrigger value="livraison">Adresse de livraison</TabsTrigger>
            </TabsList>

            <TabsContent value="principal">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Adresse principale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={profileForm.address || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="123 Rue de la Paix"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address_complement">Complément d'adresse</Label>
                    <Input
                      id="address_complement"
                      value={profileForm.address_complement || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, address_complement: e.target.value })}
                      placeholder="Bâtiment A, Étage 2, etc."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="postal_code">Code postal</Label>
                      <Input
                        id="postal_code"
                        value={profileForm.postal_code || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, postal_code: e.target.value })}
                        placeholder="75001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={profileForm.city || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        placeholder="Paris"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        value={profileForm.country || 'France'}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="livraison">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Adresse de livraison</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Adresse différente pour les livraisons (si nécessaire)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shipping_address">Adresse</Label>
                    <Input
                      id="shipping_address"
                      value={profileForm.preferred_shipping_address?.address || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        preferred_shipping_address: {
                          ...profileForm.preferred_shipping_address,
                          address: e.target.value
                        }
                      })}
                      placeholder="123 Rue de la Livraison"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shipping_postal">Code postal</Label>
                      <Input
                        id="shipping_postal"
                        value={profileForm.preferred_shipping_address?.postal_code || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          preferred_shipping_address: {
                            ...profileForm.preferred_shipping_address,
                            postal_code: e.target.value
                          }
                        })}
                        placeholder="75001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_city">Ville</Label>
                      <Input
                        id="shipping_city"
                        value={profileForm.preferred_shipping_address?.city || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          preferred_shipping_address: {
                            ...profileForm.preferred_shipping_address,
                            city: e.target.value
                          }
                        })}
                        placeholder="Paris"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_country">Pays</Label>
                      <Input
                        id="shipping_country"
                        value={profileForm.preferred_shipping_address?.country || 'France'}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          preferred_shipping_address: {
                            ...profileForm.preferred_shipping_address,
                            country: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Marketing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="marketing_phone">Téléphone pour SMS marketing</Label>
                <Input
                  id="marketing_phone"
                  value={profileForm.marketing_phone || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, marketing_phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing_consent"
                  checked={profileForm.marketing_consent}
                  onCheckedChange={(checked) =>
                    setProfileForm({ ...profileForm, marketing_consent: checked as boolean })
                  }
                />
                <Label htmlFor="marketing_consent">
                  Consentement pour recevoir des SMS marketing
                </Label>
              </div>
              <div>
                <Label htmlFor="notes">Notes internes</Label>
                <Textarea
                  id="notes"
                  value={profileForm.notes || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
                  placeholder="Notes sur ce client..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historique des adresses utilisées */}
      {userOrders.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Historique des adresses</h4>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adresses de livraison utilisées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(userOrders
                  .filter(order => order.shipping_address)
                  .map(order => JSON.stringify(order.shipping_address))))
                  .map((addressStr, index) => {
                    const address = JSON.parse(addressStr);
                    const ordersWithThisAddress = userOrders.filter(
                      order => JSON.stringify(order.shipping_address) === addressStr
                    );

                    return (
                      <div key={index} className="border rounded-lg p-3 bg-muted/50">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm font-medium">
                            {address.firstName} {address.lastName}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {ordersWithThisAddress.length} fois
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          <div>{address.address}</div>
                          <div>{address.postalCode} {address.city}</div>
                          {address.phone && <div>Tél: {address.phone}</div>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};