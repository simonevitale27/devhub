import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Flame,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Code,
  Database,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { Page } from '../types';
import UserBadge from './UserBadge';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  getHeatmapData,
  getTopicProgress,
  getTotalStats,
  getStreak,
  clearProgress,
  HeatmapDay,
  TopicProgress
} from '../services/progressService';
import { PYTHON_TOPICS } from '../pythonTypes';
import { TopicId } from '../types';
import { SQL_TOPIC_TOTALS } from '../services/exerciseGenerator';
import { PYTHON_TOPIC_TOTALS } from '../services/pythonExerciseGenerator';

// SQL Topics definition (matching types.ts TopicId enum)
const SQL_TOPICS = [
  { id: TopicId.Basics, name: 'Basics' },
  { id: TopicId.Filtering, name: 'Filtering' },
  { id: TopicId.Sorting, name: 'Sorting' },
  { id: TopicId.Functions, name: 'Functions' },
  { id: TopicId.Dates, name: 'Dates' },
  { id: TopicId.Joins, name: 'Joins' },
  { id: TopicId.Aggregation, name: 'Aggregation' },
  { id: TopicId.Case, name: 'Case' },
  { id: TopicId.Advanced, name: 'Advanced' },
];

interface AnalyticsDashboardProps {
  onBack: () => void;
  onNavigate?: (page: Page) => void;
}

// One cell of the summary strip. Deliberately NOT its own card: the four
// metrics live inside a single panel separated by hairlines, instead of four
// identical floating tiles (the stat-tile template reads as boilerplate).
function StatItem({
  icon,
  label,
  value,
  subValue,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="bg-[#0a0d16] px-5 py-5 md:px-6 md:py-6">
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="grid place-items-center w-8 h-8 rounded-lg shrink-0"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </span>
      </div>
      {/* tabular-nums so the figures don't reflow as they change */}
      <div className="text-2xl md:text-[28px] font-bold text-white tabular-nums leading-none truncate">
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-slate-500 mt-2 leading-relaxed">{subValue}</div>
      )}
    </div>
  );
}

// Heatmap Component
function ContributionHeatmap({ data }: { data: HeatmapDay[] }) {
  // Group by week for display
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  // Start from Sunday alignment
  const firstDate = new Date(data[0]?.date);
  const startDay = firstDate.getDay();

  // Add empty cells for alignment
  for (let i = 0; i < startDay; i++) {
    currentWeek.push({ date: '', count: 0, level: 0 });
  }

  data.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const levelColors = [
    'bg-slate-800',
    'bg-emerald-900/60',
    'bg-emerald-700/70',
    'bg-emerald-500/80',
    'bg-emerald-400'
  ];

  const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  return (
    <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-5 md:p-6 elev-1">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-emerald-400" />
        <h3 className="text-white font-semibold">Contribution Heatmap</h3>
        <span className="text-slate-500 text-sm ml-2">Ultimi 365 giorni</span>
      </div>

      {/* Month labels */}
      <div className="flex gap-1 mb-2 ml-8 overflow-hidden">
        {months.map((m, i) => (
          <span key={i} className="text-xs text-slate-500 w-[52px] text-center">
            {m}
          </span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          <span className="text-xs text-slate-500 h-3">Dom</span>
          <span className="text-xs text-slate-500 h-3">Lun</span>
          <span className="text-xs text-slate-500 h-3">Mar</span>
          <span className="text-xs text-slate-500 h-3">Mer</span>
          <span className="text-xs text-slate-500 h-3">Gio</span>
          <span className="text-xs text-slate-500 h-3">Ven</span>
          <span className="text-xs text-slate-500 h-3">Sab</span>
        </div>

        {/* Weeks */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className={`w-3 h-3 rounded-sm ${levelColors[day.level]} ${
                  day.date ? 'cursor-pointer hover:ring-1 hover:ring-white/30' : ''
                }`}
                title={day.date ? `${day.date}: ${day.count} esercizi` : ''}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="text-xs text-slate-500">Meno</span>
        {levelColors.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span className="text-xs text-slate-500">Più</span>
      </div>
    </div>
  );
}

// Radar Chart for Skills
function SkillRadar({
  pythonData,
  sqlData
}: {
  pythonData: TopicProgress[];
  sqlData: TopicProgress[];
}) {
  // Combine and format data for radar
  const radarData = pythonData.slice(0, 6).map(p => ({
    topic: p.topicName,
    python: p.percentage,
    fullMark: 100
  }));

  return (
    <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-5 md:p-6 elev-1">
      <div className="flex items-center gap-2 mb-4">
        <Target size={18} className="text-purple-400" />
        <h3 className="text-white font-semibold">Skill Radar</h3>
        <span className="text-slate-500 text-sm ml-2">Python Topics</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis
              dataKey="topic"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            <Radar
              name="Python"
              dataKey="python"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Progress Bar Chart
function LabProgress({
  pythonData,
  sqlData
}: {
  pythonData: TopicProgress[];
  sqlData: TopicProgress[];
}) {
  const pythonTotal = pythonData.reduce((sum, t) => sum + t.completed, 0);
  const sqlTotal = sqlData.reduce((sum, t) => sum + t.completed, 0);
  const pythonMax = pythonData.length * 60;
  const sqlMax = sqlData.length * 60;

  const chartData = [
    {
      name: 'Python Lab',
      completed: pythonTotal,
      remaining: pythonMax - pythonTotal,
      percentage: Math.round((pythonTotal / pythonMax) * 100)
    },
    {
      name: 'SQL Lab',
      completed: sqlTotal,
      remaining: sqlMax - sqlTotal,
      percentage: Math.round((sqlTotal / sqlMax) * 100)
    }
  ];

  const colors = ['#10b981', '#3b82f6'];

  return (
    <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-5 md:p-6 elev-1">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-blue-400" />
        <h3 className="text-white font-semibold">Progresso per Lab</h3>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 80, right: 30 }}
          >
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: 8
              }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                'Completato'
              ]}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Details */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-emerald-400" />
          <span className="text-slate-400 text-sm">
            Python: {pythonTotal}/{pythonMax}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Database size={16} className="text-blue-400" />
          <span className="text-slate-400 text-sm">
            SQL: {sqlTotal}/{sqlMax}
          </span>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function AnalyticsDashboard({ onBack, onNavigate }: AnalyticsDashboardProps) {
  // State for refresh trigger and confirmation modal
  const [refreshKey, setRefreshKey] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle reset
  const handleReset = async () => {
    await clearProgress();
    setShowResetConfirm(false);
    setRefreshKey(prev => prev + 1); // Force re-render
  };

  // Load data (depends on refreshKey to re-fetch after reset)
  const heatmapData = useMemo(() => getHeatmapData(365), [refreshKey]);

  const pythonProgress = useMemo(
    () =>
      getTopicProgress(
        'python',
        PYTHON_TOPICS.map(t => ({ id: t.id, name: t.label })),
        PYTHON_TOPIC_TOTALS
      ),
    [refreshKey]
  );

  const sqlProgress = useMemo(
    () =>
      getTopicProgress(
        'sql',
        SQL_TOPICS.map(t => ({ id: t.id, name: t.name })),
        SQL_TOPIC_TOTALS
      ),
    [refreshKey]
  );

  const stats = useMemo(() => getTotalStats(), [refreshKey]);
  const streak = useMemo(() => getStreak(), [refreshKey]);

  // Find best topic name
  const bestTopicName = useMemo(() => {
    if (!stats.bestTopic) return 'N/A';
    const pythonTopic = PYTHON_TOPICS.find(t => t.id === stats.bestTopic);
    if (pythonTopic) return pythonTopic.label;
    const sqlTopic = SQL_TOPICS.find(t => t.id === stats.bestTopic);
    if (sqlTopic) return sqlTopic.name;
    return stats.bestTopic;
  }, [stats.bestTopic]);

  return (
    <div className="h-screen overflow-y-auto bg-transparent text-white relative">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>

      {/* Header */}
      {/* Header — every control is the same 40px tall with the same rounded-xl
          geometry, so the row reads as one system instead of mixed pills. */}
      <header className="sticky top-0 z-50 bg-[#05070e]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={onBack}
              className="h-10 w-10 shrink-0 grid place-items-center text-slate-300 hover:text-white bg-white/[0.04] ring-1 ring-white/10 rounded-xl hover:bg-white/[0.08] transition-all active:scale-95"
              aria-label="Torna alla home"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-lg md:text-xl tracking-[-0.03em] text-white flex items-center gap-2">
                <TrendingUp size={19} className="text-emerald-400 shrink-0" />
                <span className="truncate">Analytics</span>
              </h1>
              <p className="text-slate-500 text-xs md:text-sm hidden md:block mt-0.5">
                Traccia i tuoi progressi e migliora le tue competenze
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="h-10 flex items-center gap-2 px-3.5 rounded-xl bg-red-500/[0.08] hover:bg-red-500/[0.16] ring-1 ring-red-500/20 hover:ring-red-500/40 transition-all text-red-300 text-sm font-semibold"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <UserBadge onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a0d16] ring-1 ring-white/10 rounded-2xl p-6 max-w-md mx-4 elev-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 ring-1 ring-red-500/25 grid place-items-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold tracking-[-0.02em] text-white">Conferma reset</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Sei sicuro di voler resettare tutti i progressi? Questa azione cancellerà:
            </p>
            <ul className="text-slate-400 text-sm mb-6 space-y-1 list-disc list-inside">
              <li>Tutti gli esercizi completati</li>
              <li>Lo streak attuale</li>
              <li>La heatmap dei contributi</li>
              <li>Le statistiche per topic</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 h-11 rounded-xl bg-white/[0.06] ring-1 ring-white/10 text-white font-semibold text-sm hover:bg-white/[0.1] transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleReset}
                className="flex-1 h-11 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition-colors elev-1"
              >
                Resetta tutto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-16">
        {/* Stats Grid */}
        {/* Summary strip — one panel, hairline dividers via gap-px over a tinted
            background, so the four metrics read as one considered block. */}
        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl ring-1 ring-white/[0.07] elev-1 overflow-hidden">
          <StatItem
            icon={<Target size={18} />}
            label="Completati"
            value={stats.totalCompleted}
            subValue={`Python ${stats.pythonCompleted} · SQL ${stats.sqlCompleted}`}
            color="#10b981"
          />
          <StatItem
            icon={<Flame size={18} />}
            label="Streak"
            value={`${streak} giorni`}
            subValue="Giorni consecutivi di pratica"
            color="#f59e0b"
          />
          <StatItem
            icon={<TrendingUp size={18} />}
            label="Media tentativi"
            value={stats.averageAttempts || 'N/A'}
            subValue="Per esercizio completato"
            color="#3b82f6"
          />
          <StatItem
            icon={<Award size={18} />}
            label="Topic migliore"
            value={bestTopicName}
            subValue="Più esercizi completati"
            color="#8b5cf6"
          />
        </div>

        {/* Heatmap */}
        <div className="mb-8 overflow-x-auto">
          <ContributionHeatmap data={heatmapData} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillRadar pythonData={pythonProgress} sqlData={sqlProgress} />
          <LabProgress pythonData={pythonProgress} sqlData={sqlProgress} />
        </div>

        {/* Topic Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Python Topics */}
          <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-5 md:p-6 elev-1">
            <div className="flex items-center gap-2 mb-4">
              <Code size={18} className="text-emerald-400" />
              <h3 className="text-white font-semibold">Python Topics</h3>
            </div>
            <div className="space-y-3">
              {pythonProgress.map(topic => (
                <div key={topic.topicId} className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm w-24 truncate">
                    {topic.topicName}
                  </span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                  <span className="text-slate-500 text-xs w-12 text-right">
                    {topic.completed}/{topic.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SQL Topics */}
          <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-5 md:p-6 elev-1">
            <div className="flex items-center gap-2 mb-4">
              <Database size={18} className="text-blue-400" />
              <h3 className="text-white font-semibold">SQL Topics</h3>
            </div>
            <div className="space-y-3">
              {sqlProgress.map(topic => (
                <div key={topic.topicId} className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm w-24 truncate">
                    {topic.topicName}
                  </span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                  <span className="text-slate-500 text-xs w-12 text-right">
                    {topic.completed}/{topic.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
