import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ClientOnly from '@/components/ClientOnlyCharts';

interface SalesData {
  date: string;
  orders: number;
  revenue: number;
}

interface SalesChartProps {
  data: SalesData[];
  className?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, className = '' }) => {
  const formatCurrency = (value: number) => {
    return `${(value / 100).toFixed(2)} €`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Évolution des Ventes</CardTitle>
        <CardDescription>
          Commandes et revenus des 7 derniers jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ClientOnly>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis 
                yAxisId="orders"
                orientation="left"
                className="text-xs"
              />
              <YAxis 
                yAxisId="revenue"
                orientation="right"
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <Tooltip 
                labelFormatter={(value) => formatDate(value as string)}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenus' : 'Commandes'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                yAxisId="orders"
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Commandes"
              />
              <Line 
                yAxisId="revenue"
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                name="Revenus"
              />
            </LineChart>
          </ResponsiveContainer>
          </ClientOnly>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;