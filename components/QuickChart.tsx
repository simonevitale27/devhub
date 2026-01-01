import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Label
} from 'recharts';
import { 
  BarChart3, 
  LineChart as LineIcon, 
  PieChart as PieIcon, 
  X, 
  Download, 
  Image as ImageIcon,
  FileText,
  Activity,
  Filter,
  ChevronDown,
  Check,
  Edit2,
  Palette
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface QuickChartProps {
  data: Record<string, any>[];
  onClose: () => void;
}

type ChartType = 'bar' | 'line' | 'pie' | 'area';

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

const QuickChart: React.FC<QuickChartProps> = ({ data, onClose }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSmartFilter, setShowSmartFilter] = useState(false);
  const [excludedValues, setExcludedValues] = useState<Set<string>>(new Set());
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [primaryColor, setPrimaryColor] = useState<string>('#3b82f6'); // Default primary color
  const [renamedValues, setRenamedValues] = useState<Record<string, string>>({});
  const [editingLabel, setEditingLabel] = useState<{ value: string, x: number, y: number } | null>(null);
  const [showPieLabels, setShowPieLabels] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowSmartFilter(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get all columns from data
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Detect numeric columns for Y axis
  const numericColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return columns.filter(col => {
      const value = data[0][col];
      return typeof value === 'number' || (!isNaN(parseFloat(value)) && typeof value !== 'boolean');
    });
  }, [data, columns]);

  // Detect string/category columns for X axis
  const categoryColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return columns.filter(col => {
      const value = data[0][col];
      return typeof value === 'string' || typeof value === 'number';
    });
  }, [data, columns]);

  // Auto-select axes on mount
  useEffect(() => {
    if (categoryColumns.length > 0 && !xAxis) {
      setXAxis(categoryColumns[0]);
    }
    if (numericColumns.length > 0 && !yAxis) {
      setYAxis(numericColumns[0]);
    }
    // Reset filters when axis changes
    setExcludedValues(new Set());
  }, [categoryColumns, numericColumns, xAxis, yAxis]); // Added axis deps to reset correctly

  const handleExport = async (type: 'png' | 'pdf') => {
    if (!chartRef.current) return;
    setIsExporting(true);
    setShowExportMenu(false);
    
    try {
      const originalStyle = chartRef.current.style.overflow;
      chartRef.current.style.overflow = 'visible';
      
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      chartRef.current.style.overflow = originalStyle;

      if (type === 'png') {
        const link = document.createElement('a');
        link.download = `chart_export_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`chart_export_${new Date().getTime()}.pdf`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Process data for charts
  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || !data || data.length === 0) return [];
    
    const limitedData = data.slice(0, 100);
    
    if (chartType === 'pie') {
      const aggregated: Record<string, number> = {};
      limitedData.forEach(row => {
        const key = String(row[xAxis] ?? 'Unknown');
        const value = parseFloat(row[yAxis]) || 0;
        aggregated[key] = (aggregated[key] || 0) + value;
      });
      return Object.entries(aggregated)
        .map(([name, value]) => ({ 
           name: renamedValues[name] || name, 
           originalName: name, 
           value 
        }))
        .sort((a, b) => b.value - a.value)
        .filter(item => !excludedValues.has(item.originalName))
        .slice(0, 20); // Limit logic inside pie specific
    }
    
    return limitedData
      .filter(row => !excludedValues.has(String(row[xAxis] ?? '')))
      .map(row => {
        const rawName = String(row[xAxis] ?? '');
        return {
          name: renamedValues[rawName] || rawName,
          originalName: rawName,
          value: parseFloat(row[yAxis]) || 0,
        };
      });
  }, [data, xAxis, yAxis, chartType, excludedValues, renamedValues]);

  // Unique values for Filter
  const uniqueXValues = useMemo(() => {
     if (!data || !xAxis) return [];
     return Array.from(new Set(data.map(row => String(row[xAxis] ?? '')))).sort().slice(0, 50);
  }, [data, xAxis]);

  const toggleFilter = (val: string) => {
      const next = new Set(excludedValues);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      setExcludedValues(next);
  };

  const handleColorChange = (val: string, color: string) => {
      setCustomColors(prev => ({ ...prev, [val]: color }));
  };

  const CustomizedAxisTick = (props: any) => {
      const { x, y, payload, axis } = props;
      const displayValue = renamedValues[String(payload.value)] || payload.value;
      
      return (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={0} 
            y={0} 
            dy={16} 
            textAnchor={axis === 'y' ? "end" : "end"} 
            fill="#94a3b8" 
            transform={axis === 'x' ? "rotate(-45)" : ""}
            style={{ fontSize: 11, cursor: 'pointer', userSelect: 'none' }}
            onDoubleClick={(e) => {
                e.preventDefault();
                const rect = (e.target as SVGTextElement).getBoundingClientRect();
                setEditingLabel({ value: String(payload.value), x: rect.left, y: rect.top });
            }}
          >
            {displayValue}
          </text>
        </g>
      );
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
          <BarChart3 size={48} className="opacity-20" />
          <p>Seleziona colonne valide per visualizzare il grafico</p>
        </div>
      );
    }

    const CommonAxis = [
      <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />,
      <XAxis 
        key="x"
        dataKey="name" 
        tick={<CustomizedAxisTick axis="x" />}
        height={80} // Keep height for rotated labels
        interval={0}
      />,
      <YAxis 
        key="y" 
        tick={<CustomizedAxisTick axis="y" />}
        width={70}
      />,
      <Tooltip 
        key="tooltip"
        contentStyle={{ 
          backgroundColor: '#1e293b', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color: '#f1f5f9',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
        }} 
        itemStyle={{ color: '#fff' }}
      />,
      // Default Legend disabled since we rely on axis labels, as requested to "clean up"
      // User asked for axis labels, usually replaces legend for simple single-series charts
      // But we can keep it if needed. However, user specifically asked for current value visualized "like name and price" near axis.
      // We'll keep it simple.
    ];

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              {CommonAxis}
              <Bar dataKey="value" name={yAxis || "Dati"} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={customColors[entry.originalName] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              {CommonAxis}
              <Line 
                type="monotone" 
                dataKey="value"
                name={yAxis || "Dati"} 
                stroke={primaryColor} // Use primary color
                strokeWidth={3}
                dot={{ fill: primaryColor, r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              {CommonAxis}
              <Area 
                type="monotone" 
                dataKey="value"
                name={yAxis || "Dati"} 
                stroke={primaryColor} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <div className="w-full h-full relative">
             {/* Chart Side - Absolute Left */}
             <div className="absolute inset-y-0 left-0 right-52 px-4 py-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={showPieLabels}
                      outerRadius={showPieLabels ? "50%" : "70%"}
                      innerRadius={showPieLabels ? "25%" : "40%"}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      paddingAngle={5}
                      label={showPieLabels ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : null}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={customColors[entry.originalName] || COLORS[index % COLORS.length]} 
                          stroke="rgba(0,0,0,0.5)" 
                          strokeWidth={2} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f1f5f9'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             
             {/* Side Legend - Absolute Right Fixed Width */}
             <div className="absolute inset-y-0 right-0 w-52 border-l border-white/5 pl-4 py-4 flex flex-col h-full bg-[#111]/50 backdrop-blur-sm rounded-r-2xl">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 shrink-0">Legenda</h4>
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {chartData.map((entry, index) => (
                       <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-white/5 hover:bg-white/10 transition-colors group shrink-0">
                            <div 
                                className="w-3 h-3 rounded-full shrink-0 cursor-pointer shadow-sm" 
                                style={{ backgroundColor: customColors[entry.originalName] || COLORS[index % COLORS.length] }}
                                onClick={(e) => {
                                      e.preventDefault();
                                }}
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                                <span 
                                    className="text-xs text-slate-200 font-medium truncate cursor-pointer hover:text-white"
                                    title={entry.name}
                                    onDoubleClick={(e) => {
                                        e.preventDefault();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setEditingLabel({ value: entry.originalName, x: rect.left - 260, y: rect.top });
                                    }}
                                >
                                    {entry.name}
                                </span>
                                <div className="flex justify-between items-center mt-0.5">
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {(entry.value).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-1.5 rounded">
                                        {Math.round( (entry.value / chartData.reduce((acc, curr) => acc + curr.value, 0)) * 100 )}%
                                    </span>
                                </div>
                            </div>
                       </div>
                    ))}
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-8">
      <div className="w-full max-w-7xl h-[90vh] bg-[#0a0a0a] rounded-3xl flex flex-col border border-white/10 shadow-2xl relative">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white/5 backdrop-blur-md border-b border-white/5 relative z-20 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Activity size={24} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Data Visualization</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">{data.length} records</span>
                <span>•</span>
                <span>Generated via SQL Query</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filters */}
            <div className="relative" ref={filterRef}>
               <button
                  onClick={() => setShowSmartFilter(!showSmartFilter)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all text-sm font-medium ${
                    showSmartFilter || excludedValues.size > 0 
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
               >
                  <Filter size={16} />
                  Filtra
                  {excludedValues.size > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                      {excludedValues.size}
                    </span>
                  )}
               </button>

               {showSmartFilter && (
                 <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-2">
                    <div className="px-2 py-1.5 text-[10px] text-slate-500 uppercase font-bold border-b border-white/5 mb-1 flex justify-between items-center">
                        <span>Filtra {xAxis || 'dati'}</span>
                        {excludedValues.size > 0 && (
                          <button onClick={() => setExcludedValues(new Set())} className="text-red-400 hover:underline">Reset</button>
                        )}
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                       {uniqueXValues.map(val => (
                            <div
                                 key={val}
                                 className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors mb-0.5 group/item ${
                                     excludedValues.has(val) ? 'bg-transparent text-slate-500' : 'bg-white/5 hover:bg-white/10 text-slate-200'
                                 }`}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                     {/* Checkbox */}
                                     <button 
                                        onClick={() => toggleFilter(val)}
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                          !excludedValues.has(val) ? 'bg-blue-500 border-blue-500' : 'border-slate-600 hover:border-slate-500'
                                        }`}
                                     >
                                          {!excludedValues.has(val) && <Check size={10} className="text-white" />}
                                     </button>

                                     {/* Color Picker or Icon */}
                                     {chartType !== 'line' && chartType !== 'area' && (
                                         <div className="relative shrink-0 w-3.5 h-3.5 group/color ml-1">
                                            <div 
                                              className="w-full h-full rounded-full cursor-pointer shadow-sm transition-transform hover:scale-110 ring-1 ring-white/10"
                                              style={{ 
                                                  backgroundColor: customColors[val] || COLORS[uniqueXValues.indexOf(val) % COLORS.length]
                                              }}
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  const input = e.currentTarget.nextElementSibling as HTMLInputElement;
                                                  input?.click();
                                              }}
                                            />
                                            <input 
                                              type="color" 
                                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                              value={customColors[val] || COLORS[uniqueXValues.indexOf(val) % COLORS.length]}
                                              onChange={(e) => handleColorChange(val, e.target.value)}
                                            />
                                         </div>
                                     )}

                                     <span 
                                        className={`truncate cursor-pointer ${excludedValues.has(val) ? 'line-through opacity-50' : ''}`}
                                        onClick={() => toggleFilter(val)}
                                        title={renamedValues[val] || val || '(Vuoto)'}
                                     >
                                         {renamedValues[val] || val || '(Vuoto)'}
                                     </span>
                                </div>

                                {/* Edit Button */}
                                <button 
                                    className="p-1 text-slate-500 hover:text-white hover:bg-white/10 rounded transition-colors opacity-0 group-hover/item:opacity-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setEditingLabel({ value: val, x: rect.left - 200, y: rect.top });
                                    }}
                                >
                                    <Edit2 size={12} />
                                </button>
                            </div>
                        ))}
                        {uniqueXValues.length === 0 && (
                            <div className="p-2 text-xs text-slate-500 text-center">Seleziona asse X per filtrare</div>
                        )}
                    </div>
                 </div>
               )}
            </div>

            {/* Export Menu */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-lg transition-all text-sm font-medium"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Esporta Grafico
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100 z-50">
                   <button
                    onClick={() => handleExport('png')}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <ImageIcon size={16} className="text-purple-400" />
                    Salva come PNG
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <FileText size={16} className="text-red-400" />
                    Salva come PDF
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden rounded-b-3xl">
          {/* Controls Sidebar */}
          <div className="w-64 bg-[#0f0f0f] border-r border-white/5 p-6 flex flex-col gap-8 overflow-y-auto">
            
            {/* Chart Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo Grafico</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    chartType === 'bar' ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <BarChart3 size={20} />
                  <span className="text-xs">Barre</span>
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    chartType === 'line' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <LineIcon size={20} />
                  <span className="text-xs">Linee</span>
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    chartType === 'area' ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Activity size={20} />
                  <span className="text-xs">Area</span>
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    chartType === 'pie' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <PieIcon size={20} />
                  <span className="text-xs">Torta</span>
                </button>
              </div>

              {/* Primary Color Picker (Line/Area) */}
              {(chartType === 'line' || chartType === 'area') && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                         <Palette size={12} />
                         Colore Principale
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                            <button
                                key={c}
                                onClick={() => setPrimaryColor(c)}
                                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${primaryColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f0f0f]' : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 hover:border-white/50 cursor-pointer group">
                             <input 
                                type="color" 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                                <span className="text-[8px] text-white">+</span>
                            </div>
                        </div>
                    </div>
                </div>
              )}
            </div>

            {/* Axes Config */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Asse X (Categoria)
                </label>
                <div className="relative">
                    <select
                        value={xAxis}
                        onChange={(e) => setXAxis(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer hover:bg-white/5 transition-colors pr-8"
                    >
                        <option value="">Seleziona...</option>
                        {categoryColumns.map(col => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Asse Y (Valore)
                </label>
                <div className="relative">
                    <select
                        value={yAxis}
                        onChange={(e) => setYAxis(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer hover:bg-white/5 transition-colors pr-8"
                    >
                        <option value="">Seleziona...</option>
                        {numericColumns.map(col => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Pie Chart Options */}
            {chartType === 'pie' && (
               <div className="space-y-2 animate-in fade-in">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opzioni Torta</label>
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-sm text-slate-300">Mostra Etichette</span>
                      <button 
                          onClick={() => setShowPieLabels(!showPieLabels)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${showPieLabels ? 'bg-blue-500' : 'bg-slate-700'}`}
                      >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${showPieLabels ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                  </div>
               </div>
            )}


          </div>

          {/* Chart Display */}
          <div className="flex-1 p-8 bg-gradient-to-br from-[#0a0a0a] to-[#121212] overflow-hidden flex flex-col">
            <div 
              ref={chartRef}
              className="flex-1 w-full bg-[#111] rounded-2xl border border-white/5 p-6 shadow-inner custom-chart-container relative outline-none focus:outline-none"
            >
              {/* Title Overlay for Export */}
               <div className="absolute top-6 left-6 opacity-0 export-visible pointer-events-none">
                  <h3 className="text-2xl font-bold text-white mb-2">Analisi Dati</h3>
                  <p className="text-slate-400 text-sm">Generato da DevHub SQL Gym</p>
               </div>
               
              {renderChart()}

            </div>
          </div>
        </div>
      </div>
      
      {/* Styles for export capture */}
      <style>{`
        .custom-chart-container.capturing {
          background: #000 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>

      {/* Label Editor Modal */}
      {editingLabel && (
           <div className="fixed inset-0 z-[110] flex items-center justify-center bg-transparent" onClick={() => setEditingLabel(null)}>
                <div 
                    className="absolute bg-[#1a1a1a] border border-white/20 rounded-xl p-3 shadow-2xl flex flex-col gap-2 animate-in text-white w-64"
                    style={{ left: Math.min(editingLabel.x, window.innerWidth - 270), top: editingLabel.y - 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                     <label className="text-xs text-slate-400 font-bold uppercase">Rinomina etichetta</label>
                     <input 
                        autoFocus
                        type="text" 
                        defaultValue={renamedValues[editingLabel.value] || editingLabel.value}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setRenamedValues(prev => ({ ...prev, [editingLabel.value]: e.currentTarget.value }));
                                setEditingLabel(null);
                            } else if (e.key === 'Escape') {
                                setEditingLabel(null);
                            }
                        }}
                     />
                     <div className="flex justify-end gap-2 mt-1">
                         <button onClick={() => setEditingLabel(null)} className="text-xs px-2 py-1 hover:bg-white/10 rounded">Annulla</button>
                         <button 
                            onClick={(e) => {
                                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                                setRenamedValues(prev => ({ ...prev, [editingLabel.value]: input.value }));
                                setEditingLabel(null);
                            }} 
                            className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded"
                         >
                             Salva
                         </button>
                     </div>
                </div>
           </div>
      )}

    </div>
  );
};

export default QuickChart;
