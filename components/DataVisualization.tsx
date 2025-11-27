import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { getChartConfig } from '../utils/sqlHelpers';

interface DataVisualizationProps {
  data: any[];
  solutionQuery: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, solutionQuery }) => {
  // Early return for invalid data
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-slate-500 italic text-sm text-center border-t border-slate-800">
        Grafico non disponibile - dati insufficienti
      </div>
    );
  }

  const chartConfig = useMemo(() => {
    try {
      return getChartConfig(solutionQuery, data);
    } catch (error) {
      console.error('Chart config error:', error);
      return { type: 'none' as const, xKey: '', yKey: '' };
    }
  }, [solutionQuery, data]);

  // No chart available for this query
  if (chartConfig.type === 'none') {
    return (
      <div className="p-4 text-slate-500 italic text-sm text-center border-t border-slate-800">
        Grafico non disponibile per questa query
      </div>
    );
  }

  // Color palette for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#84cc16'];

  if (chartConfig.type === 'none' || !data || data.length === 0) {
    return null;
  }

  // Format data for charts
  const chartData = data.map((row, idx) => ({
    name: String(row[chartConfig.xKey] || `Item ${idx + 1}`),
    value: Number(row[chartConfig.yKey]) || 0,
    ...row
  }));

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <YAxis 
          stroke="#94a3b8"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#e2e8f0'
          }}
          labelStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
        />
        <Legend 
          wrapperStyle={{ color: '#94a3b8' }}
          iconType="circle"
        />
        <Bar 
          dataKey="value" 
          fill="#3b82f6" 
          name={chartConfig.yKey}
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#e2e8f0'
          }}
        />
        <Legend 
          wrapperStyle={{ color: '#94a3b8' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderKPICard = () => {
    const value = data[0][chartConfig.yKey];
    const numericValue = Number(value);
    
    // Format the number with thousands separator
    const formattedValue = numericValue.toLocaleString('it-IT', {
      maximumFractionDigits: 2
    });

    // Create a clean label from the column name (remove parentheses content for display)
    let label = chartConfig.yKey;
    // If it's something like "SUM(stock)", extract "SUM" and "stock"
    const match = label.match(/^(\w+)\((.+)\)$/);
    if (match) {
      const [, func, col] = match;
      label = `${func} di ${col}`;
    }

    return (
      <div className="flex justify-center items-center py-8">
        <div className="relative group">
          {/* Background gradient glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          
          {/* KPI Card */}
          <div className="relative px-12 py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              {/* Label */}
              <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                {label}
              </div>
              
              {/* Big Number */}
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {formattedValue}
              </div>
              
              {/* Icon decoration */}
              <div className="flex gap-2 mt-2">
                <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
                <div className="h-1 w-8 bg-purple-500 rounded-full"></div>
                <div className="h-1 w-8 bg-pink-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border-t border-slate-800 bg-[#0f172a] p-4">
      <div className="flex items-center gap-2 mb-4">
        {chartConfig.type === 'bar' ? (
          <BarChart3 size={18} className="text-blue-400" />
        ) : chartConfig.type === 'pie' ? (
          <PieChartIcon size={18} className="text-purple-400" />
        ) : (
          <BarChart3 size={18} className="text-pink-400" />
        )}
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          {chartConfig.type === 'bar' 
            ? 'Visualizzazione Dati (Grafico a Barre)' 
            : chartConfig.type === 'pie'
            ? 'Visualizzazione Dati (Grafico a Torta)'
            : 'KPI - Valore Aggregato'}
        </h3>
      </div>
      
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
        {chartConfig.type === 'bar' 
          ? renderBarChart() 
          : chartConfig.type === 'pie'
          ? renderPieChart()
          : renderKPICard()}
      </div>

      <div className="mt-3 text-xs text-slate-500 italic">
        💡 {chartConfig.type === 'kpi' 
          ? 'KPI Card generata automaticamente per query con valore aggregato singolo (SUM, COUNT, AVG, MAX, MIN)'
          : 'Grafico generato automaticamente rilevando aggregazioni nella query (GROUP BY, COUNT, SUM, AVG)'}
      </div>
    </div>
  );
};

export default DataVisualization;
