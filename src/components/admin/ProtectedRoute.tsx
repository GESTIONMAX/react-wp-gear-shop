import React from 'react';
import { AdminOnlyRoute } from './RoleProtectedRoute';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Wrapper pour maintenir la compatibilité avec l'ancien système
// Cette route est maintenant équivalente à AdminOnlyRoute
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <AdminOnlyRoute>
      {children}
    </AdminOnlyRoute>
  );
};

export default ProtectedRoute;