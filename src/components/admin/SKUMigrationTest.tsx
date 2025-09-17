import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';

const SKUMigrationTest: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [skuColumnExists, setSkuColumnExists] = useState<boolean | null>(null);

  const checkSKUColumn = async () => {
    setIsChecking(true);
    try {
      // Tenter de faire une query avec le champ SKU
      const { data, error } = await supabase
        .from('product_variants')
        .select('id, sku')
        .limit(1);

      if (error) {
        console.error('Erreur lors de la vérification:', error);
        setSkuColumnExists(false);
        toast({
          title: "Colonne SKU manquante",
          description: `Le champ SKU n'existe pas dans la table product_variants: ${error.message}`,
          variant: "destructive",
        });
      } else {
        setSkuColumnExists(true);
        toast({
          title: "Colonne SKU trouvée",
          description: "Le champ SKU existe dans la base de données.",
        });
      }
    } catch (err) {
      console.error('Erreur:', err);
      setSkuColumnExists(false);
    } finally {
      setIsChecking(false);
    }
  };

  const applySKUMigration = async () => {
    setIsMigrating(true);
    try {
      // Appliquer manuellement la migration SKU
      const migrationSQL = `
        -- Ajouter la colonne SKU si elle n'existe pas
        ALTER TABLE product_variants
        ADD COLUMN IF NOT EXISTS sku VARCHAR(100);

        -- Ajouter une contrainte d'unicité sur le SKU si elle n'existe pas
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'unique_product_variant_sku'
          ) THEN
            ALTER TABLE product_variants
            ADD CONSTRAINT unique_product_variant_sku UNIQUE (sku);
          END IF;
        END $$;

        -- Créer un index pour les performances si il n'existe pas
        CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
      `;

      const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

      if (error) {
        console.error('Erreur lors de la migration:', error);
        toast({
          title: "Erreur de migration",
          description: `Impossible d'appliquer la migration: ${error.message}`,
          variant: "destructive",
        });
      } else {
        setSkuColumnExists(true);
        toast({
          title: "Migration appliquée",
          description: "La colonne SKU a été ajoutée avec succès.",
        });
      }
    } catch (err) {
      console.error('Erreur migration:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'application de la migration.",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Test Migration SKU
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Vérifiez si la colonne SKU existe dans la table product_variants et appliquez la migration si nécessaire.
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={checkSKUColumn}
            disabled={isChecking}
            variant="outline"
          >
            {isChecking ? 'Vérification...' : 'Vérifier colonne SKU'}
          </Button>

          {skuColumnExists !== null && (
            <div className="flex items-center gap-2">
              {skuColumnExists ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-sm">SKU trouvé</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 text-sm">SKU manquant</span>
                </>
              )}
            </div>
          )}
        </div>

        {skuColumnExists === false && (
          <div className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">Migration nécessaire</h4>
            <p className="text-sm text-amber-700 mb-3">
              La colonne SKU n'existe pas dans la base de données. Cliquez sur le bouton ci-dessous pour l'ajouter.
            </p>
            <Button
              onClick={applySKUMigration}
              disabled={isMigrating}
              variant="default"
            >
              {isMigrating ? 'Application...' : 'Appliquer migration SKU'}
            </Button>
          </div>
        )}

        {skuColumnExists === true && (
          <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Migration OK</h4>
            <p className="text-sm text-green-700">
              La colonne SKU existe et est prête à être utilisée. Vous pouvez maintenant créer des variantes avec des SKU.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SKUMigrationTest;