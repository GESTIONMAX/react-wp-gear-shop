import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load charts to prevent SSR issues with recharts
const SalesChart = React.lazy(() => import('./admin/SalesChart'));
const TopProductsChart = React.lazy(() => import('./admin/TopProductsChart'));

const ChartFallback = () => (
  <Card className="w-full h-64">
    <CardContent className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </CardContent>
  </Card>
);

export const LazySalesChart = (props: React.ComponentProps<typeof SalesChart>) => (
  <Suspense fallback={<ChartFallback />}>
    <SalesChart {...props} />
  </Suspense>
);

export const LazyTopProductsChart = (props: React.ComponentProps<typeof TopProductsChart>) => (
  <Suspense fallback={<ChartFallback />}>
    <TopProductsChart {...props} />
  </Suspense>
);