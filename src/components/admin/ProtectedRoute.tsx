import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useAdmin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading, error } = useIsAdmin();

  // Chargement en cours
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">Vérification des permissions</h2>
            <p className="text-sm text-muted-foreground text-center">
              Vérification de vos droits d'accès...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur non connecté
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Erreur lors de la vérification du rôle
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
            <h2 className="text-lg font-semibold mb-2">Erreur d'authentification</h2>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Impossible de vérifier vos permissions. Veuillez réessayer.
            </p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur non autorisé
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              Seuls les administrateurs peuvent accéder à l'interface d'administration.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                Retour
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur autorisé
  return <>{children}</>;
};

export default ProtectedRoute;