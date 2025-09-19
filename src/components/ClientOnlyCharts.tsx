import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// This component ensures charts only render on the client side
// to prevent SSR hydration mismatches with chart libraries (Recharts, Nivo, etc.)

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card className="w-full h-64">
        <CardContent className="flex items-center justify-center h-full">
          {fallback || (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          )}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ClientOnly;