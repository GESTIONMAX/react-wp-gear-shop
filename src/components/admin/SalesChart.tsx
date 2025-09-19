import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveLine } from '@nivo/line';
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
  // Formater la devise
  const formatCurrency = (value: number) => {
    return `${(value / 100).toFixed(2)} €`;
  };

  // Formater la date pour l'affichage
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Transformer les données pour Nivo (format avec des séries)
  const nivoData = [
    {
      id: 'Commandes',
      color: 'hsl(var(--primary))',
      data: data.map(item => ({
        x: formatDate(item.date),
        y: item.orders,
        originalDate: item.date,
        originalValue: item.orders
      }))
    },
    {
      id: 'Revenus',
      color: 'hsl(var(--chart-2))',
      data: data.map(item => ({
        x: formatDate(item.date),
        y: item.revenue / 100, // Conversion en euros pour l'affichage
        originalDate: item.date,
        originalValue: item.revenue
      }))
    }
  ];

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Évolution des Ventes</CardTitle>
        <CardDescription>
          Commandes et revenus des 7 derniers jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-80">
            <ClientOnly>
              <ResponsiveLine
                data={nivoData}
                margin={{ top: 20, right: 80, left: 80, bottom: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false
                }}
                yFormat=" >-.2f"
                curve="monotoneX"
                axisTop={null}
                axisRight={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Revenus (€)',
                  legendOffset: 60,
                  legendPosition: 'middle',
                  format: value => `${value.toFixed(0)}€`,
                  truncateTickAt: 0
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: '',
                  legendOffset: 36,
                  legendPosition: 'middle',
                  truncateTickAt: 0
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Commandes',
                  legendOffset: -60,
                  legendPosition: 'middle',
                  truncateTickAt: 0
                }}
                enableGridX={false}
                enableGridY={true}
                gridYValues={5}
                colors={({ color }) => color}
                pointSize={6}
                pointColor={{ from: 'color' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableArea={false}
                areaOpacity={0.1}
                useMesh={true}
                legends={[
                  {
                    anchor: 'top-left',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: -20,
                    itemsSpacing: 20,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                tooltip={({ point }) => {
                  const serieColor = point?.color || '#3b82f6';
                  const serieId = (point as any)?.serie?.id || 'Unknown';

                  return (
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
                        Date: {point?.data?.originalDate ? formatDate(point.data.originalDate as string) : point?.data?.xFormatted || 'N/A'}
                      </div>
                      <div style={{ color: serieColor, fontWeight: '500' }}>
                        {serieId}: {serieId === 'Revenus'
                          ? formatCurrency((point?.data?.originalValue as number) || ((point?.data?.y as number) * 100) || 0)
                          : (point?.data?.originalValue || point?.data?.y || 0)
                        }
                      </div>
                    </div>
                  );
                }}
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
                  legends: {
                    text: {
                      fontSize: 11,
                      fill: 'hsl(var(--foreground))',
                      fontWeight: 500
                    }
                  }
                }}
                animate={true}
                motionConfig="gentle"
                role="application"
                ariaLabel="Graphique d'évolution des ventes"
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

export default SalesChart;