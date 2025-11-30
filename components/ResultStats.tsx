import React, { useMemo } from 'react';
import { TrendingUp, Hash, Type, AlertCircle } from 'lucide-react';
import { analyzeResultStats, ColumnStats } from '../utils/statsHelpers';

import DataVisualization from './DataVisualization';

interface ResultStatsProps {
  data: any[];
  query: string;
}

const ResultStats: React.FC<ResultStatsProps> = ({ data, query }) => {
  const stats = useMemo(() => analyzeResultStats(data), [data]);

  // Don't show stats if less than 2 rows (unless it's a KPI which DataVisualization handles)
  // But ResultStats logic for cards requires stats.length > 0
  const showCards = data && data.length >= 2 && stats.length > 0;

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <DataVisualization data={data} solutionQuery={query} />

      {/* Stats Cards Section */}
      {showCards && (
        <div className="p-4 bg-zinc-900/40 backdrop-blur-xl rounded-lg border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-blue-400" />
            <h3 className="text-sm font-bold text-slate-300">Statistiche Colonne</h3>
            <span className="text-xs text-slate-500">
              ({data.length} righe analizzate)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {stats.map((columnStat) => (
              <ColumnStatCard key={columnStat.columnName} stat={columnStat} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ColumnStatCardProps {
  stat: ColumnStats;
}

const ColumnStatCard: React.FC<ColumnStatCardProps> = ({ stat }) => {
  const isNumeric = stat.type === 'numeric';

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-200 hover:scale-102 ${
        isNumeric
          ? 'bg-blue-900/10 border-blue-700/30 hover:border-blue-600/50'
          : 'bg-emerald-900/10 border-emerald-700/30 hover:border-emerald-600/50'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
        {isNumeric ? (
          <Hash size={14} className="text-blue-400" />
        ) : (
          <Type size={14} className="text-emerald-400" />
        )}
        <span className="text-xs font-bold text-slate-200 truncate flex-1">
          {stat.columnName}
        </span>
        {stat.nullCount > 0 && (
          <span
            className="text-[10px] px-1.5 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-red-300"
            title={`${stat.nullCount} valori NULL`}
          >
            {stat.nullCount} NULL
          </span>
        )}
      </div>

      {/* Stats Content */}
      <div className="space-y-1.5">
        {isNumeric && stat.numericStats ? (
          <>
            <StatRow
              label="Media"
              value={stat.numericStats.avg}
              color="text-blue-300"
            />
            <StatRow
              label="Min"
              value={stat.numericStats.min}
              color="text-slate-400"
            />
            <StatRow
              label="Max"
              value={stat.numericStats.max}
              color="text-slate-400"
            />
            <StatRow
              label="Somma"
              value={stat.numericStats.sum}
              color="text-blue-400"
              bold
            />
          </>
        ) : stat.textStats ? (
          <div className="flex items-center justify-between py-1">
            <span className="text-[11px] text-slate-500">Valori unici</span>
            <span className="text-sm font-bold text-emerald-300">
              {stat.textStats.distinctCount}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface StatRowProps {
  label: string;
  value: number;
  color?: string;
  bold?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({
  label,
  value,
  color = 'text-slate-300',
  bold = false,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className={`text-xs ${color} ${bold ? 'font-bold' : 'font-medium'}`}>
        {value.toLocaleString('it-IT')}
      </span>
    </div>
  );
};

export default ResultStats;
