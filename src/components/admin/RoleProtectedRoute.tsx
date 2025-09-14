import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, AlertTriangle, Users, UserCheck } from 'lucide-react';
import { UserRole } from '@/hooks/useAdmin';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireInternal?: boolean;
  fallbackPath?: string;
  errorMessage?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireInternal = false,
  fallbackPath = "/auth",
  errorMessage
}) => {
  const { user, loading, userInfo } = useAuth();

  console.log('=== RoleProtectedRoute Debug ===');
  console.log('User:', !!user, user?.email);
  console.log('Loading:', loading);
  console.log('UserInfo:', userInfo);
  console.log('AllowedRoles:', allowedRoles);
  console.log('RequireInternal:', requireInternal);

  // Chargement en cours
  if (loading) {
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
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérifications des permissions
  const hasRequiredRole = userInfo.role && allowedRoles.includes(userInfo.role);
  const isInternalWhenRequired = !requireInternal || userInfo.isInternal;

  if (!hasRequiredRole || !isInternalWhenRequired) {
    const getAccessDeniedContent = () => {
      if (requireInternal && !userInfo.isInternal) {
        return {
          icon: <Users className="h-16 w-16 text-muted-foreground mb-4" />,
          title: "Accès réservé au personnel",
          message: "Cette page est réservée aux membres du personnel interne. Les clients n'ont pas accès à cette section."
        };
      }

      if (!hasRequiredRole) {
        return {
          icon: <UserCheck className="h-16 w-16 text-muted-foreground mb-4" />,
          title: "Permissions insuffisantes",
          message: errorMessage || `Vous n'avez pas le rôle requis pour accéder à cette page. Rôles autorisés: ${allowedRoles.join(', ')}`
        };
      }

      return {
        icon: <Shield className="h-16 w-16 text-muted-foreground mb-4" />,
        title: "Accès refusé",
        message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
      };
    };

    const content = getAccessDeniedContent();

    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            {content.icon}
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {content.message}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Retour
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Accueil
              </Button>
              {userInfo.isInternal && (
                <Button variant="secondary" onClick={() => window.location.href = '/admin'}>
                  Administration
                </Button>
              )}
            </div>

            {/* Informations de debug en développement */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-3 bg-muted rounded text-xs text-left w-full">
                <strong>Debug Info:</strong><br />
                Rôle actuel: {userInfo.role || 'aucun'}<br />
                Type: {userInfo.userType || 'aucun'}<br />
                Interne: {userInfo.isInternal ? 'oui' : 'non'}<br />
                Rôles requis: {allowedRoles.join(', ')}<br />
                Interne requis: {requireInternal ? 'oui' : 'non'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur autorisé
  return <>{children}</>;
};

// Composants spécialisés pour des cas d'usage courants
export const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleProtectedRoute
    allowedRoles={['admin']}
    requireInternal={true}
    errorMessage="Cette page est réservée aux administrateurs."
  >
    {children}
  </RoleProtectedRoute>
);

export const InternalStaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleProtectedRoute
    allowedRoles={['admin', 'staff']}
    requireInternal={true}
    errorMessage="Cette page est réservée aux administrateurs et au personnel."
  >
    {children}
  </RoleProtectedRoute>
);

export const InternalOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleProtectedRoute
    allowedRoles={['admin', 'staff', 'employee']}
    requireInternal={true}
    errorMessage="Cette page est réservée au personnel interne."
  >
    {children}
  </RoleProtectedRoute>
);

export const ClientOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleProtectedRoute
    allowedRoles={['client']}
    requireInternal={false}
    errorMessage="Cette page est réservée aux clients."
  >
    {children}
  </RoleProtectedRoute>
);

export default RoleProtectedRoute;