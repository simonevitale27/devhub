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
  Label,
  ReferenceLine
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
  
  // Chart Title State
  const [chartTitle, setChartTitle] = useState<string>('');
  const [titleColor, setTitleColor] = useState<string>('#ffffff');
  const [titleSize, setTitleSize] = useState<number>(20);
  const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>('left');
  
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Feature States
  const [showDataTable, setShowDataTable] = useState(false);
  const [showTrendline, setShowTrendline] = useState(false);
  const [topN, setTopN] = useState<number | null>(null);
  const [showMeanLine, setShowMeanLine] = useState(false);
  const [annotations, setAnnotations] = useState<Array<{id: string, text: string, dataIndex: number}>>([]);
  const [newAnnotation, setNewAnnotation] = useState<{ x: number, y: number, dataIndex: number } | null>(null);
  const [annotationText, setAnnotationText] = useState("");

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
      
      // Make export overlay visible
      chartRef.current.classList.add('capturing');
      const exportOverlay = chartRef.current.querySelector('.export-visible');
      if (exportOverlay) {
        (exportOverlay as HTMLElement).style.opacity = '1';
      }
      
      // Small delay for DOM update
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Hide export overlay again
      if (exportOverlay) {
        (exportOverlay as HTMLElement).style.opacity = '0';
      }
      chartRef.current.classList.remove('capturing');
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

  // Export CSV function
  const handleExportCSV = () => {
    if (chartData.length === 0) return;
    const csvContent = [
      `${xAxis},${yAxis}`,
      ...chartData.map(row => `"${row.name}",${row.value}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chart_data_${new Date().getTime()}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  // Copy Image to clipboard
  const handleCopyImage = async () => {
    if (!chartRef.current) return;
    try {
      chartRef.current.classList.add('capturing');
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false
      });
      chartRef.current.classList.remove('capturing');
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          alert('Immagine copiata negli appunti!');
        }
      });
    } catch (err) {
      console.error('Copy failed:', err);
    }
    setShowExportMenu(false);
  };

  // Export JSON function
  const handleExportJSON = () => {
    if (chartData.length === 0) return;
    const jsonData = {
      title: chartTitle || 'Chart Data',
      xAxis,
      yAxis,
      data: chartData.map(row => ({ [xAxis]: row.name, [yAxis]: row.value }))
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chart_data_${new Date().getTime()}.json`;
    link.click();
    setShowExportMenu(false);
  };

  // Export SVG function
  const handleExportSVG = () => {
    if (!chartRef.current) return;
    const svg = chartRef.current.querySelector('svg');
    if (!svg) {
      alert('Nessun grafico SVG trovato');
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chart_${new Date().getTime()}.svg`;
    link.click();
    setShowExportMenu(false);
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
      let result = Object.entries(aggregated)
        .map(([name, value]) => ({ 
           name: renamedValues[name] || name, 
           originalName: name, 
           value 
        }))
        .sort((a, b) => b.value - a.value)
        .filter(item => !excludedValues.has(item.originalName));
      
      // Apply topN filter
      if (topN && topN > 0) {
        result = result.slice(0, topN);
      }
      return result.slice(0, 20);
    }
    
    let result = limitedData
      .filter(row => !excludedValues.has(String(row[xAxis] ?? '')))
      .map(row => {
        const rawName = String(row[xAxis] ?? '');
        return {
          name: renamedValues[rawName] || rawName,
          originalName: rawName,
          value: parseFloat(row[yAxis]) || 0,
        };
      });
    
    // Apply topN filter
    if (topN && topN > 0) {
      result = result.sort((a, b) => b.value - a.value).slice(0, topN);
    }
    
    return result;
  }, [data, xAxis, yAxis, chartType, excludedValues, renamedValues, topN]);

  // Calculate mean for mean line
  const meanValue = useMemo(() => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((acc, curr) => acc + curr.value, 0);
    return sum / chartData.length;
  }, [chartData]);
  
  const handleChartClick = (e: any) => {
    // Only allow annotations on Cartesian charts for now
    if (chartType === 'pie') return;
    
    if (e && e.activeTooltipIndex !== undefined && e.chartX && e.chartY) {
      setNewAnnotation({
        x: e.chartX,
        y: e.chartY,
        dataIndex: e.activeTooltipIndex
      });
      setAnnotationText("");
    }
  };

  const handleAddAnnotation = () => {
    if (newAnnotation && annotationText.trim()) {
      setAnnotations(prev => [
        ...prev, 
        {
          id: crypto.randomUUID(),
          text: annotationText,
          dataIndex: newAnnotation.dataIndex
        }
      ]);
      setNewAnnotation(null);
      setAnnotationText("");
    }
  };

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
      const valueStr = String(displayValue);
      
      // Smart rotation: numbers and short text stay horizontal on X-axis
      const isNumeric = !isNaN(Number(payload.value));
      const isShort = valueStr.length <= 6;
      const shouldRotate = axis === 'x' && !isNumeric && !isShort;
      
      return (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={0} 
            y={0} 
            dy={shouldRotate ? 8 : 16} 
            textAnchor={shouldRotate ? "end" : (axis === 'y' ? "end" : "middle")} 
            fill="#94a3b8" 
            transform={shouldRotate ? "rotate(-45)" : ""}
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
        height={80}
        interval={0}
      >
        <Label value={xAxis} position="insideBottom" offset={-10} fill="#64748b" fontSize={11} fontWeight="500" />
      </XAxis>,
      <YAxis 
        key="y" 
        tick={<CustomizedAxisTick axis="y" />}
        width={80}
      >
        <Label value={yAxis} angle={-90} position="insideLeft" offset={5} fill="#64748b" fontSize={11} fontWeight="500" style={{ textAnchor: 'middle' }} />
      </YAxis>,
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
            <BarChart onClick={handleChartClick} data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              {CommonAxis}
              {showMeanLine && (
                <ReferenceLine 
                  y={meanValue} 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: `Media: ${meanValue.toFixed(1)}`, position: 'right', fill: '#f59e0b', fontSize: 11 }}
                />
              )}
              {annotations.map(ann => chartData[ann.dataIndex] ? (
                <ReferenceLine 
                  key={ann.id} 
                  x={chartData[ann.dataIndex].name} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3"
                  label={{ value: ann.text, position: 'top', fill: '#ef4444', fontSize: 10, offset: 10 }} 
                />
              ) : null)}
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
      case 'line': {
        // Calculate trendline data if enabled
        const trendData = showTrendline && chartData.length > 1 ? (() => {
          const n = chartData.length;
          const sumX = chartData.reduce((a, _, i) => a + i, 0);
          const sumY = chartData.reduce((a, d) => a + d.value, 0);
          const sumXY = chartData.reduce((a, d, i) => a + i * d.value, 0);
          const sumXX = chartData.reduce((a, _, i) => a + i * i, 0);
          const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;
          return chartData.map((d, i) => ({ ...d, trend: slope * i + intercept }));
        })() : chartData;
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart onClick={handleChartClick} data={trendData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              {CommonAxis}
              {showMeanLine && (
                <ReferenceLine 
                  y={meanValue} 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: `Media: ${meanValue.toFixed(1)}`, position: 'right', fill: '#f59e0b', fontSize: 11 }}
                />
              )}
              {annotations.map(ann => chartData[ann.dataIndex] ? (
                <ReferenceLine 
                  key={ann.id} 
                  x={chartData[ann.dataIndex].name} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3"
                  label={{ value: ann.text, position: 'top', fill: '#ef4444', fontSize: 10, offset: 10 }} 
                />
              ) : null)}
              <Line 
                type="monotone" 
                dataKey="value"
                name={yAxis || "Dati"} 
                stroke={primaryColor}
                strokeWidth={3}
                dot={{ fill: primaryColor, r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
              {showTrendline && (
                <Line 
                  type="linear" 
                  dataKey="trend"
                  name="Trend" 
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  activeDot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      }
      case 'area': {
        // Calculate trendline data if enabled
        const trendData = showTrendline && chartData.length > 1 ? (() => {
          const n = chartData.length;
          const sumX = chartData.reduce((a, _, i) => a + i, 0);
          const sumY = chartData.reduce((a, d) => a + d.value, 0);
          const sumXY = chartData.reduce((a, d, i) => a + i * d.value, 0);
          const sumXX = chartData.reduce((a, _, i) => a + i * i, 0);
          const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;
          return chartData.map((d, i) => ({ ...d, trend: slope * i + intercept }));
        })() : chartData;
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart onClick={handleChartClick} data={trendData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              {CommonAxis}
              {showMeanLine && (
                <ReferenceLine 
                  y={meanValue} 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: `Media: ${meanValue.toFixed(1)}`, position: 'right', fill: '#f59e0b', fontSize: 11 }}
                />
              )}
              {annotations.map(ann => chartData[ann.dataIndex] ? (
                <ReferenceLine 
                  key={ann.id} 
                  x={chartData[ann.dataIndex].name} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3"
                  label={{ value: ann.text, position: 'top', fill: '#ef4444', fontSize: 10, offset: 10 }} 
                />
              ) : null)}
              <Area 
                type="monotone" 
                dataKey="value"
                name={yAxis || "Dati"} 
                stroke={primaryColor} 
                fillOpacity={1} 
                fill="url(#colorValue)"
              />
              {showTrendline && (
                <Line 
                  type="linear" 
                  dataKey="trend"
                  name="Trend" 
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
      }
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
             <div className="absolute inset-y-0 right-0 w-52 border-l border-white/5 pl-3 py-3 flex flex-col h-full bg-[#111]/50 backdrop-blur-sm rounded-r-2xl">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 shrink-0">Legenda</h4>
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
                    {chartData.map((entry, index) => (
                       <div key={index} className={`flex items-center gap-2 rounded-lg p-1.5 border transition-colors group shrink-0 ${excludedValues.has(entry.originalName) ? 'bg-transparent border-white/5 opacity-50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            {/* Checkbox */}
                            <button
                                onClick={() => toggleFilter(entry.originalName)}
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors shrink-0 ${!excludedValues.has(entry.originalName) ? 'bg-blue-500 border-blue-500' : 'border-slate-600 hover:border-slate-500'}`}
                            >
                                {!excludedValues.has(entry.originalName) && <Check size={8} className="text-white" />}
                            </button>
                            {/* Color Picker */}
                            <div className="relative w-3 h-3 shrink-0">
                                <div 
                                    className="w-full h-full rounded-full cursor-pointer shadow-sm ring-1 ring-white/10 hover:scale-110 transition-transform" 
                                    style={{ backgroundColor: customColors[entry.originalName] || COLORS[index % COLORS.length] }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        (e.currentTarget.nextElementSibling as HTMLInputElement)?.click();
                                    }}
                                />
                                <input
                                    type="color"
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    value={customColors[entry.originalName] || COLORS[index % COLORS.length]}
                                    onChange={(e) => handleColorChange(entry.originalName, e.target.value)}
                                />
                            </div>
                            {/* Name + Value */}
                            <div className="flex flex-col min-w-0 flex-1">
                                <span 
                                    className={`text-[10px] font-medium truncate ${excludedValues.has(entry.originalName) ? 'line-through text-slate-500' : 'text-slate-200'}`}
                                    title={entry.name}
                                >
                                    {entry.name}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">
                                    {(entry.value).toLocaleString()} ({Math.round((entry.value / chartData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%)
                                </span>
                            </div>
                            {/* Edit Icon */}
                            <button
                                className="p-0.5 text-slate-500 hover:text-white hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setEditingLabel({ value: entry.originalName, x: rect.left - 200, y: rect.top });
                                }}
                            >
                                <Edit2 size={10} />
                            </button>
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
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100 z-50">
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
                  <div className="border-t border-white/10" />
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Download size={16} className="text-green-400" />
                    Esporta CSV
                  </button>
                  <button
                    onClick={handleCopyImage}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Check size={16} className="text-blue-400" />
                    Copia Immagine
                  </button>
                  <div className="border-t border-white/10" />
                  <button
                    onClick={handleExportSVG}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <ImageIcon size={16} className="text-cyan-400" />
                    Esporta SVG
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <FileText size={16} className="text-yellow-400" />
                    Esporta JSON
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

            {/* Chart Title Customization */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Edit2 size={12} />
                Titolo Grafico
              </label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Inserisci titolo..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 placeholder:text-slate-600"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500 block mb-1">Posizione</label>
                  <div className="flex gap-1">
                    {/* Word-style alignment icons */}
                    <button
                      onClick={() => setTitleAlign('left')}
                      className={`flex-1 py-2 rounded border transition-colors flex items-center justify-center ${titleAlign === 'left' ? 'bg-blue-500 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}
                    >
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <rect x="0" y="0" width="14" height="2" rx="1" fill={titleAlign === 'left' ? 'white' : '#64748b'}/>
                        <rect x="0" y="4" width="10" height="2" rx="1" fill={titleAlign === 'left' ? 'white' : '#64748b'}/>
                        <rect x="0" y="8" width="12" height="2" rx="1" fill={titleAlign === 'left' ? 'white' : '#64748b'}/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setTitleAlign('center')}
                      className={`flex-1 py-2 rounded border transition-colors flex items-center justify-center ${titleAlign === 'center' ? 'bg-blue-500 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}
                    >
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <rect x="0" y="0" width="14" height="2" rx="1" fill={titleAlign === 'center' ? 'white' : '#64748b'}/>
                        <rect x="2" y="4" width="10" height="2" rx="1" fill={titleAlign === 'center' ? 'white' : '#64748b'}/>
                        <rect x="1" y="8" width="12" height="2" rx="1" fill={titleAlign === 'center' ? 'white' : '#64748b'}/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setTitleAlign('right')}
                      className={`flex-1 py-2 rounded border transition-colors flex items-center justify-center ${titleAlign === 'right' ? 'bg-blue-500 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}
                    >
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <rect x="0" y="0" width="14" height="2" rx="1" fill={titleAlign === 'right' ? 'white' : '#64748b'}/>
                        <rect x="4" y="4" width="10" height="2" rx="1" fill={titleAlign === 'right' ? 'white' : '#64748b'}/>
                        <rect x="2" y="8" width="12" height="2" rx="1" fill={titleAlign === 'right' ? 'white' : '#64748b'}/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500 block mb-1">Dimensione</label>
                  <select
                    value={titleSize}
                    onChange={(e) => setTitleSize(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value={16}>S</option>
                    <option value={20}>M</option>
                    <option value={24}>L</option>
                    <option value={32}>XL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Colore</label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer shadow-inner"
                    style={{ backgroundColor: titleColor }}
                    onClick={() => (document.getElementById('titleColorPicker') as HTMLInputElement)?.click()}
                  />
                  <input
                    id="titleColorPicker"
                    type="color"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    className="opacity-0 absolute w-0 h-0"
                  />
                  <span className="text-xs text-slate-400 font-mono">{titleColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opzioni Avanzate</label>
              
              {/* Data Table Toggle */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                <span className="text-xs text-slate-300">Mostra Tabella Dati</span>
                <button 
                  onClick={() => setShowDataTable(!showDataTable)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${showDataTable ? 'bg-blue-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${showDataTable ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Trendline Toggle (Line/Area only) */}
              {(chartType === 'line' || chartType === 'area') && (
                <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-xs text-slate-300">Linea di Tendenza</span>
                  <button 
                    onClick={() => setShowTrendline(!showTrendline)}
                    className={`w-9 h-5 rounded-full relative transition-colors ${showTrendline ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${showTrendline ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              )}

              {/* Mean Line Toggle (Cartesian only) */}
              {chartType !== 'pie' && (
                <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-xs text-slate-300">Mostra Media</span>
                  <button 
                    onClick={() => setShowMeanLine(!showMeanLine)}
                    className={`w-9 h-5 rounded-full relative transition-colors ${showMeanLine ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${showMeanLine ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              )}

              {/* Top N Filter */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500">Top N (0 = tutti)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={topN || 0}
                  onChange={(e) => setTopN(Number(e.target.value) || null)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                  placeholder="Mostra primi N valori"
                />
              </div>
            </div>



          </div>

          {/* Chart Display */}
          <div className="flex-1 p-8 bg-gradient-to-br from-[#0a0a0a] to-[#121212] overflow-hidden flex flex-col">
            <div 
              ref={chartRef}
              tabIndex={-1}
              className="flex-1 w-full bg-[#111] rounded-2xl border border-white/5 p-6 shadow-inner custom-chart-container relative outline-none focus:outline-none"
              style={{ outline: 'none' }}
            >
              {/* Export Overlay with Logo - only visible during export */}
               
              {/* Visible Chart Title - hidden during export to avoid duplicate */}
              {chartTitle && (
                <div 
                  className={`absolute top-3 z-10 export-hide ${titleAlign === 'center' ? 'left-1/2 -translate-x-1/2' : titleAlign === 'right' ? 'right-4' : 'left-4'}`}
                >
                  <h3 
                    className="font-bold" 
                    style={{ fontSize: titleSize, color: titleColor, textAlign: titleAlign }}
                  >
                    {chartTitle}
                  </h3>
                </div>
              )}
               
              {/* Export Title - only visible during export */}
              <div className="absolute top-3 left-4 opacity-0 export-visible pointer-events-none z-10">
                <h3 className="font-bold" style={{ fontSize: titleSize, color: titleColor }}>
                  {chartTitle || 'Analisi Dati'}
                </h3>
              </div>
               
              <div className={`w-full h-full relative ${chartTitle ? 'pt-8' : ''}`}>
                {renderChart()}
                
                {newAnnotation && (
                  <div 
                    className="absolute z-50 bg-[#1e293b] p-2 rounded-lg shadow-xl border border-white/10 flex gap-2 items-center animate-in fade-in zoom-in duration-200" 
                    style={{ left: newAnnotation.x, top: newAnnotation.y }}
                    onClick={e => e.stopPropagation()}
                  >
                    <input 
                      autoFocus
                      type="text" 
                      value={annotationText} 
                      onChange={e => setAnnotationText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddAnnotation()}
                      className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white w-40 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Scrivi nota..."
                    />
                    <button onClick={handleAddAnnotation} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-emerald-400 transition-colors">
                        <Check size={14} />
                    </button>
                    <button onClick={() => setNewAnnotation(null)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors">
                        <X size={14} />
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Data Table View */}
            {showDataTable && (
              <div className="w-80 border-l border-white/5 bg-[#0a0a0a] flex flex-col shrink-0 max-h-full">
                {/* Header with chart title */}
                <div className="px-4 py-3 border-b border-white/10 shrink-0 bg-[#0a0a0a]">
                  {chartTitle && (
                    <h3 className="text-sm font-bold text-white mb-1 truncate">{chartTitle}</h3>
                  )}
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-wider">{chartData.length} righe</h4>
                </div>
                {/* Table header - sticky */}
                <div className="px-3 py-2 bg-[#0d0d0d] border-b border-white/10 flex shrink-0">
                  <span className="flex-1 text-[10px] font-semibold text-slate-400">{xAxis}</span>
                  <span className="text-[10px] font-semibold text-slate-400 text-right">{yAxis}</span>
                </div>
                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                  {chartData.map((row, i) => (
                    <div key={i} className="px-3 py-2 flex border-b border-white/5 hover:bg-white/5 transition-colors">
                      <span className="flex-1 text-xs text-slate-300 truncate pr-2" title={row.name}>{row.name}</span>
                      <span className="text-xs text-slate-200 font-mono tabular-nums">{row.value.toLocaleString()}</span>
                    </div>
                  ))}
                  {/* Spacer to ensure last row is fully visible */}
                  <div className="h-4 shrink-0" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Styles for export capture */}
      <style>{`
        .custom-chart-container.capturing {\n          background: #000 !important;\n        }\n        .custom-chart-container.capturing .export-hide {\n          opacity: 0 !important;\n        }\n        .custom-chart-container.capturing .export-visible {\n          opacity: 1 !important;\n        }\n        .custom-chart-container:focus,\n        .custom-chart-container:focus-visible,\n        .custom-chart-container *:focus {\n          outline: none !important;\n          box-shadow: none !important;\n        }\n        .custom-scrollbar::-webkit-scrollbar {\n          width: 6px;\n        }\n        .custom-scrollbar::-webkit-scrollbar-track {\n          background: rgba(255,255,255,0.02);\n        }\n        .custom-scrollbar::-webkit-scrollbar-thumb {\n          background: rgba(255,255,255,0.15);\n          border-radius: 4px;\n        }\n        .custom-scrollbar::-webkit-scrollbar-thumb:hover {\n          background: rgba(255,255,255,0.25);\n        }\n      `}</style>

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
