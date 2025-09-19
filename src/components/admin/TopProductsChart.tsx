import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveBar } from '@nivo/bar';
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
  // Formater la devise
  const formatCurrency = (value: number) => {
    return `${(value / 100).toFixed(2)} €`;
  };

  // Tronquer le nom pour l'affichage
  const truncateName = (name: string, maxLength: number = 15) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  // Transformer les données pour Nivo
  const nivoData = data.map(item => ({
    id: item.id,
    name: truncateName(item.name, 12),
    fullName: item.name, // Garder le nom complet pour le tooltip
    quantity: item.quantity,
    revenue: item.revenue
  }));

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
              <ResponsiveBar
                data={nivoData}
                keys={['quantity']}
                indexBy="name"
                margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={() => 'hsl(var(--primary))'}
                borderRadius={4}
                borderWidth={0}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: '',
                  legendPosition: 'middle',
                  legendOffset: 40,
                  truncateTickAt: 0
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Quantité',
                  legendPosition: 'middle',
                  legendOffset: -40,
                  truncateTickAt: 0
                }}
                enableGridX={false}
                enableGridY={true}
                gridYValues={5}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: 'color',
                  modifiers: [['darker', 1.6]]
                }}
                tooltip={({ value, data }) => (
                  <div
                    style={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#1e293b'
                    }}
                  >
                    <div style={{ marginBottom: '4px', fontWeight: '600' }}>
                      Produit: {data?.fullName || 'N/A'}
                    </div>
                    <div style={{ color: '#3b82f6' }}>
                      Quantité vendue: {value}
                    </div>
                    {data?.revenue && (
                      <div style={{ color: '#64748b' }}>
                        Revenus: {formatCurrency(data.revenue)}
                      </div>
                    )}
                  </div>
                )}
                animate={true}
                motionConfig="gentle"
                role="application"
                ariaLabel="Graphique des top produits"
                barAriaLabel={e => `${e.id}: ${e.formattedValue} unités vendues`}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: 'hsl(var(--border))',
                        strokeWidth: 1
                      }
                    },
                    legend: {
                      text: {
                        fontSize: 12,
                        fill: 'hsl(var(--foreground))',
                        fontWeight: 500
                      }
                    },
                    ticks: {
                      line: {
                        stroke: 'hsl(var(--border))',
                        strokeWidth: 1
                      },
                      text: {
                        fontSize: 11,
                        fill: 'hsl(var(--muted-foreground))'
                      }
                    }
                  },
                  grid: {
                    line: {
                      stroke: 'hsl(var(--border))',
                      strokeWidth: 1,
                      strokeDasharray: '3 3',
                      opacity: 0.3
                    }
                  },
                  labels: {
                    text: {
                      fontSize: 11,
                      fontWeight: 500
                    }
                  }
                }}
              />
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