import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const ImageUploadDebug: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const testUpload = async () => {
    setTesting(true);
    try {
      // 1. Vérifier l'authentification
      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log('Auth status:', { authData, authError });

      // 2. Lister les buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('Buckets:', { buckets, bucketsError });

      // 3. Vérifier le bucket variant-images
      const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket('variant-images');
      console.log('Bucket info:', { bucketInfo, bucketError });

      // 4. Créer un fichier test minimal
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      // 5. Essayer l'upload avec différentes méthodes
      console.log('Tentative upload 1: chemin simple');
      const { error: uploadError1 } = await supabase.storage
        .from('variant-images')
        .upload('debug/test-1.txt', testFile);

      console.log('Upload 1 result:', uploadError1);

      console.log('Tentative upload 2: avec options');
      const { error: uploadError2 } = await supabase.storage
        .from('variant-images')
        .upload('debug/test-2.txt', testFile, {
          cacheControl: '3600',
          upsert: true
        });

      console.log('Upload 2 result:', uploadError2);

      // 6. Vérifier les politiques (si on peut)
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('schemaname', 'storage')
        .eq('tablename', 'objects');

      console.log('Policies:', { policies, policiesError });

      setDebugInfo({
        auth: { authData, authError },
        buckets: { buckets, bucketsError },
        bucketInfo: { bucketInfo, bucketError },
        upload1: uploadError1,
        upload2: uploadError2,
        policies: { policies, policiesError }
      });

      toast({
        title: "Debug terminé",
        description: "Vérifiez la console pour les détails",
      });

    } catch (error) {
      console.error('Debug error:', error);
      toast({
        title: "Erreur debug",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Debug Upload Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testUpload} disabled={testing} className="w-full">
          {testing ? 'Test en cours...' : 'Tester l\'upload et diagnostiquer'}
        </Button>

        {Object.keys(debugInfo).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Résultats du diagnostic :</h3>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Ce composant va :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Vérifier l'état d'authentification</li>
            <li>Lister tous les buckets disponibles</li>
            <li>Vérifier la configuration du bucket variant-images</li>
            <li>Tenter plusieurs méthodes d'upload</li>
            <li>Afficher les politiques de sécurité</li>
          </ul>
          <p className="mt-2">Ouvrez la console navigateur (F12) pour voir tous les détails.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadDebug;