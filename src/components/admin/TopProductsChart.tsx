import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ClientOnly from '@/components/ClientOnlyCharts';

interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface TopProductsChartProps {
  data: TopProduct[];
  className?: string;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data, className = '' }) => {
  const formatCurrency = (value: number) => {
    return `${(value / 100).toFixed(2)} €`;
  };

  const truncateName = (name: string, maxLength: number = 15) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Produits</CardTitle>
        <CardDescription>
          Les 5 produits les plus vendus
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-80">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tickFormatter={(value) => truncateName(value, 10)}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Revenus' : 'Quantité vendue'
                  ]}
                  labelFormatter={(label) => `Produit: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="quantity" 
                  fill="hsl(var(--primary))"
                  name="Quantité"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Aucune donnée disponible</p>
              <p className="text-sm">Les ventes apparaîtront ici</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProductsChart;