import React, { useMemo, useState, useRef } from 'react';
import { SaleItem } from '../types';
import KamaIcon from './icons/KamaIcon';

interface AnalysisDashboardProps {
  sales: SaleItem[];
}

const formatKamas = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
};

const StatCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-[#3B385E] p-4 rounded-lg shadow-md h-full ${className}`}>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
        {children}
    </div>
);

const SalesChart: React.FC<{sales: SaleItem[]}> = ({ sales }) => {
    const [tooltip, setTooltip] = useState<{ x: number, y: number, date: string, kamas: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const chartData = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const parseDate = (dateString: string) => {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        
        const salesByDay: { [key: string]: number } = {};

        sales.forEach(sale => {
            try {
                const saleDate = parseDate(sale.saleDate);
                if (saleDate >= thirtyDaysAgo) {
                    const dayKey = saleDate.toISOString().split('T')[0];
                    salesByDay[dayKey] = (salesByDay[dayKey] || 0) + (sale.kamas || 0);
                }
            } catch(e) {
                // Ignore invalid date formats
            }
        });

        const dataPoints = Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayKey = date.toISOString().split('T')[0];
            return { date: dayKey, kamas: salesByDay[dayKey] || 0 };
        }).reverse();

        const maxKamas = Math.max(...dataPoints.map(p => p.kamas), 0);
        
        if (maxKamas === 0) return null;

        return { dataPoints, maxKamas };
    }, [sales]);

    if (!chartData) {
        return <p className="text-gray-400">Pas assez de données pour afficher le graphique.</p>;
    }
    
    const { dataPoints, maxKamas } = chartData;
    const width = 500;
    const height = 150;

    const getCoords = (point: { date: string, kamas: number }, index: number) => {
      const x = (index / (dataPoints.length - 1)) * width;
      const y = height - (point.kamas / maxKamas) * height;
      return { x, y };
    };

    const path = dataPoints.map((point, i) => {
        const { x, y } = getCoords(point, i);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left;
        const pointIndex = Math.round((mouseX / svgRect.width) * (dataPoints.length - 1));
        const point = dataPoints[pointIndex];
        if (point) {
            const { x, y } = getCoords(point, pointIndex);
            setTooltip({ x, y, date: new Date(point.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), kamas: point.kamas });
        }
    };
    
    return (
        <div className="relative">
            <svg ref={svgRef} viewBox="0 0 500 150" className="w-full h-auto" onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
                <path d={path} fill="none" stroke="#fBBF24" strokeWidth="2" />
                {tooltip && (
                    <g>
                        <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#fBBF24" stroke="white" strokeWidth="2" />
                    </g>
                )}
            </svg>
            {tooltip && (
                <div className="absolute p-2 text-xs bg-[#1e1c3a] border border-gray-600 rounded-md shadow-lg pointer-events-none text-white"
                     style={{
                        left: `${(tooltip.x / width) * 100}%`,
                        top: `${tooltip.y - 60}px`,
                        transform: 'translateX(-50%)',
                     }}>
                    <div className="font-bold">{tooltip.date}</div>
                    <div className="flex items-center">{formatKamas(tooltip.kamas)} <KamaIcon className="ml-1 h-3 w-3"/></div>
                </div>
            )}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>il y a 30 jours</span>
                <span>Aujourd'hui</span>
            </div>
        </div>
    );
};


const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ sales }) => {
    const stats = useMemo(() => {
        if (sales.length === 0) {
            return null;
        }

        const totalKamas = sales.reduce((acc, item) => acc + (item.kamas || 0), 0);
        const totalItemsSold = sales.reduce((acc, item) => acc + (item.quantity || 0), 0);

        const mostExpensiveSale = sales.reduce((max, item) => ((item.kamas || 0) > (max.kamas || 0) ? item : max), sales[0]);

        const itemFrequency: { [key: string]: number } = sales.reduce((acc, item) => {
            acc[item.itemName] = (acc[item.itemName] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        
        const mostFrequentItem = Object.entries(itemFrequency).reduce((max, entry) => (entry[1] > max[1] ? entry : max), ["", 0]);

        const itemProfits: { [key: string]: number } = sales.reduce((acc, item) => {
            acc[item.itemName] = (acc[item.itemName] || 0) + (item.kamas || 0);
            return acc;
        }, {} as { [key: string]: number });

        const topProfitableItems = Object.entries(itemProfits)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return { totalKamas, totalItemsSold, mostExpensiveSale, mostFrequentItem, topProfitableItems };
    }, [sales]);

    if (!stats) {
        return null; // Should be handled by parent component
    }

    return (
        <div className="space-y-6">
            <StatCard title="Gains en Kamas (30 derniers jours)">
                <SalesChart sales={sales} />
            </StatCard>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Kamas totaux générés">
                    <div className="flex items-center text-3xl font-bold text-yellow-400">
                        <span>{formatKamas(stats.totalKamas)}</span>
                        <KamaIcon className="ml-2 h-7 w-7"/>
                    </div>
                </StatCard>
                <StatCard title="Objets vendus au total">
                    <p className="text-3xl font-bold text-gray-200">{stats.totalItemsSold.toLocaleString('fr-FR')}</p>
                </StatCard>
                <StatCard title="Vente la plus chère">
                    {stats.mostExpensiveSale && (
                        <>
                            <p className="text-lg font-semibold text-gray-200 truncate">{stats.mostExpensiveSale.itemName}</p>
                            <div className="flex items-center text-md font-bold text-yellow-400">
                            <span>{formatKamas(stats.mostExpensiveSale.kamas || 0)}</span>
                            <KamaIcon className="ml-1 h-4 w-4"/>
                            </div>
                        </>
                    )}
                </StatCard>
                <StatCard title="Objet le plus vendu">
                    {stats.mostFrequentItem && stats.mostFrequentItem[0] && (
                        <>
                            <p className="text-lg font-semibold text-gray-200 truncate">{stats.mostFrequentItem[0]}</p>
                            <p className="text-md text-gray-400">{stats.mostFrequentItem[1]} ventes</p>
                        </>
                    )}
                </StatCard>
                <div className="md:col-span-2 lg:col-span-2">
                    <StatCard title="Top 5 des objets les plus rentables">
                        {stats.topProfitableItems.length > 0 ? (
                            <ol className="space-y-2">
                                {stats.topProfitableItems.map(([name, profit], index) => (
                                    <li key={name} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center">
                                            <span className="text-gray-400 w-6 text-center">{index + 1}.</span>
                                            <span className="font-medium text-gray-200 ml-2">{name}</span>
                                        </div>
                                        <div className="flex items-center font-semibold text-yellow-400">
                                            <span>{formatKamas(profit)}</span>
                                            <KamaIcon className="ml-2 h-4 w-4" />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="text-gray-400">Pas assez de données.</p>
                        )}
                    </StatCard>
                </div>
            </div>
        </div>
    );
};

export default AnalysisDashboard;