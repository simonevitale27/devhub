import React, { useMemo } from 'react';
import { BarChart3, Hash, Type, Calendar, Percent, TrendingUp, TrendingDown, Circle } from 'lucide-react';

interface DataProfilingProps {
  data: Record<string, unknown>[];
  columns: string[];
}

interface ColumnProfile {
  name: string;
  type: 'numeric' | 'text' | 'date' | 'boolean' | 'mixed';
  count: number;
  nullCount: number;
  nullPercent: number;
  uniqueCount: number;
  uniquePercent: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
  mode?: string;
  sample: string[];
}

const DataProfiling: React.FC<DataProfilingProps> = ({ data, columns }) => {
  const profiles = useMemo(() => {
    if (!data || data.length === 0 || !columns || columns.length === 0) return [];

    return columns.map(col => {
      const values = data.map(row => row[col]);
      const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
      
      // Determine type
      let type: ColumnProfile['type'] = 'text';
      const numericValues = nonNullValues.filter(v => !isNaN(Number(v)));
      const dateValues = nonNullValues.filter(v => !isNaN(Date.parse(String(v))));
      
      if (numericValues.length === nonNullValues.length && nonNullValues.length > 0) {
        type = 'numeric';
      } else if (dateValues.length === nonNullValues.length && nonNullValues.length > 0 && 
                 nonNullValues.every(v => String(v).match(/\d{4}[-/]\d{2}[-/]\d{2}/))) {
        type = 'date';
      } else if (nonNullValues.every(v => typeof v === 'boolean' || v === 'true' || v === 'false')) {
        type = 'boolean';
      }

      // Calculate statistics
      const count = values.length;
      const nullCount = count - nonNullValues.length;
      const nullPercent = (nullCount / count) * 100;
      const uniqueValues = new Set(nonNullValues.map(v => String(v)));
      const uniqueCount = uniqueValues.size;
      const uniquePercent = (uniqueCount / nonNullValues.length) * 100;

      // Mode (most frequent value)
      const frequency: Record<string, number> = {};
      nonNullValues.forEach(v => {
        const key = String(v);
        frequency[key] = (frequency[key] || 0) + 1;
      });
      const mode = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0];

      // Sample values
      const sample = Array.from(uniqueValues).slice(0, 5);

      let profile: ColumnProfile = {
        name: col,
        type,
        count,
        nullCount,
        nullPercent,
        uniqueCount,
        uniquePercent,
        mode,
        sample
      };

      // Numeric-specific stats
      if (type === 'numeric') {
        const nums = numericValues.map(v => Number(v)).sort((a, b) => a - b);
        profile.min = nums[0];
        profile.max = nums[nums.length - 1];
        profile.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const mid = Math.floor(nums.length / 2);
        profile.median = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      }

      // Date-specific stats
      if (type === 'date') {
        const dates = nonNullValues.map(v => new Date(String(v))).sort((a, b) => a.getTime() - b.getTime());
        profile.min = dates[0]?.toISOString().split('T')[0];
        profile.max = dates[dates.length - 1]?.toISOString().split('T')[0];
      }

      // Text-specific stats (min/max length could be added)
      if (type === 'text') {
        const lengths = nonNullValues.map(v => String(v).length).sort((a, b) => a - b);
        if (lengths.length > 0) {
          profile.min = lengths[0];
          profile.max = lengths[lengths.length - 1];
        }
      }

      return profile;
    });
  }, [data, columns]);

  if (profiles.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">Esegui una query per vedere il profilo dei dati</p>
      </div>
    );
  }

  const getTypeIcon = (type: ColumnProfile['type']) => {
    switch (type) {
      case 'numeric': return <Hash size={14} className="text-blue-400" />;
      case 'text': return <Type size={14} className="text-green-400" />;
      case 'date': return <Calendar size={14} className="text-purple-400" />;
      case 'boolean': return <Circle size={14} className="text-yellow-400" />;
      default: return <Type size={14} className="text-slate-400" />;
    }
  };

  const formatNumber = (n: number | undefined) => {
    if (n === undefined) return '-';
    return n.toLocaleString('it-IT', { maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 size={16} className="text-blue-400" />
          Data Profiling
        </h3>
        <span className="text-xs text-slate-500">{profiles.length} colonne • {data.length} righe</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/5 text-slate-400">
              <th className="text-left px-3 py-2 font-semibold">Colonna</th>
              <th className="text-left px-3 py-2 font-semibold">Tipo</th>
              <th className="text-right px-3 py-2 font-semibold">Valori</th>
              <th className="text-right px-3 py-2 font-semibold">Unici</th>
              <th className="text-right px-3 py-2 font-semibold">Null%</th>
              <th className="text-right px-3 py-2 font-semibold">Min</th>
              <th className="text-right px-3 py-2 font-semibold">Max</th>
              <th className="text-right px-3 py-2 font-semibold">Media</th>
              <th className="text-left px-3 py-2 font-semibold">Campione</th>
            </tr>
          </thead>
        </table>
        
        {/* Scrollable Body */}
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-xs">
            <tbody>
              {profiles.map((profile, i) => (
                <tr key={profile.name} className={`border-b border-white/5 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="px-3 py-2.5 font-medium text-white w-[15%]">{profile.name}</td>
                  <td className="px-3 py-2.5 w-[10%]">
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(profile.type)}
                      <span className="text-slate-300 capitalize">{profile.type}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right text-slate-300 font-mono w-[10%]">{profile.count.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right w-[10%]">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-300 font-mono">{profile.uniqueCount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right w-[10%]">
                    <span className={`font-mono ${profile.nullPercent > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {profile.nullPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right w-[10%]">
                    <span className="text-slate-300 font-mono">{formatNumber(profile.min as number)}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right w-[10%]">
                    <span className="text-slate-300 font-mono">{formatNumber(profile.max as number)}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right w-[10%]">
                    <span className="text-slate-300 font-mono">
                      {profile.type === 'numeric' ? formatNumber(profile.mean) : '-'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-left w-[15%]">
                     <div className="flex flex-wrap gap-1">
                        {profile.sample.slice(0, 3).map((val, idx) => (
                          <span key={idx} className="inline-block px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 border border-white/5 truncate max-w-[80px]" title={val}>{val}</span>
                        ))}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataProfiling;
