import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  Lightbulb,
  Eye,
  Database,
  Layers,
  Code2,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  Download,
  Wand2,
  Keyboard,
  TrendingUp,
  X,
  Home as HomeIcon,
  Search,
  GitBranch,
  Dumbbell,
  Shuffle,
  Unlock,
  Lock,
  Code,
  XCircle,
  AlertTriangle,
  Bot,
  History,
  Bug,
} from "lucide-react";
import { downloadCSV, compareResults } from "../utils/sqlHelpers";
import { format } from "sql-formatter";
import {
  Difficulty,
  TopicId,
  QueryResult,
  ValidationResult,
  Exercise,
  PracticeMode,
} from "../types";
import { DB_SCHEMAS, TOPICS, generateCopyCodeSnippets } from "../constants";
import {
  initDatabase,
  runQuery,
  translateSqlError,
} from "../services/sqlService";
import { explainSqlError } from "../services/mockAiService";
import { generateExercises } from "../services/exerciseGenerator";
import SchemaViewer from "./SchemaViewer";
import CodeEditor from "./CodeEditor";
import ResultsTable from "./ResultsTable";
import ResultStats from "./ResultStats";
import SchemaERDiagram from "./SchemaERDiagram";
import ResultDiff from "./ResultDiff";
import ErrorBoundary from "./ErrorBoundary";

interface SqlGymProps {
  onBack: () => void;
}

const SqlGym: React.FC<SqlGymProps> = ({ onBack }) => {
  const [currentTopicId, setCurrentTopicId] = useState<TopicId>(TopicId.Basics);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(
    PracticeMode.Solve
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const exercise = useMemo(() => {
    if (!exercises || exercises.length === 0) return null;
    if (currentExerciseIndex < 0 || currentExerciseIndex >= exercises.length)
      return exercises[0];
    return exercises[currentExerciseIndex];
  }, [exercises, currentExerciseIndex]);

  const [sqlCode, setSqlCode] = useState("");
  const [userResult, setUserResult] = useState<QueryResult | null>(null);
  const [expectedResult, setExpectedResult] = useState<any[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showErrorExplanation, setShowErrorExplanation] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false); // New state for stats modal
  const [isDbReady, setIsDbReady] = useState(false);
  const [showDbPanel, setShowDbPanel] = useState(false);
  const [showERDiagram, setShowERDiagram] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const isGymMode = practiceMode === PracticeMode.Solve;

  // --- DYNAMIC THEME COLORS ---
  const themeColor = isGymMode ? "blue" : "purple";
  const bgActive = isGymMode ? "bg-blue-600" : "bg-purple-600";
  const textActive = isGymMode ? "text-blue-400" : "text-purple-400";
  const borderActive = isGymMode ? "border-blue-500" : "border-purple-500";
  const shadowActive = isGymMode
    ? "shadow-blue-600/20"
    : "shadow-purple-600/20";
  const bgThemeLight = isGymMode ? "bg-blue-500/5" : "bg-purple-500/5"; // Reduced opacity for cleaner look
  const borderThemeLight = isGymMode
    ? "border-blue-500/20"
    : "border-purple-500/20";
  const bgThemeGradient = isGymMode ? "from-blue-900/20" : "from-purple-900/20"; // Reduced opacity
  const focusBorderTheme = isGymMode
    ? "focus:border-blue-500/50"
    : "focus:border-purple-500/50";

  // --- DIFFICULTY COLORS ---
  const difficultyColors = {
    [Difficulty.Easy]: {
      bg: "bg-green-600",
      text: "text-green-400",
      border: "border-green-500",
      shadow: "shadow-green-600/20",
    },
    [Difficulty.Medium]: {
      bg: "bg-orange-600",
      text: "text-orange-400",
      border: "border-orange-500",
      shadow: "shadow-orange-600/20",
    },
    [Difficulty.Hard]: {
      bg: "bg-red-600",
      text: "text-red-400",
      border: "border-red-500",
      shadow: "shadow-red-600/20",
    },
  };
  const difficultyColor = difficultyColors[difficulty];

  const loadContent = useCallback(() => {
    setIsLoading(true);
    setUserResult(null);
    setValidation(null);
    setShowHint(false);
    setShowErrorExplanation(false);
    setSqlCode("");
    setShowSolution(false);
    setShowStatsModal(false); // Close stats modal on new content load

    try {
      // Initialize database for both Gym and Debug modes
      initDatabase(difficulty);
      
      if (practiceMode === PracticeMode.Type) {
        // Debug Mode - use standard exercises which have brokenCode and debugHint
        const newExercises = generateExercises(currentTopicId, difficulty);
        setExercises(newExercises || []);
        setCurrentExerciseIndex(0);
        setIsDbReady(true);
      } else {
        // Gym Mode - use standard exercises
        const newExercises = generateExercises(currentTopicId, difficulty);
        setExercises(newExercises || []);
        setCurrentExerciseIndex(0);
        setIsDbReady(true);
      }
    } catch (e) {
      console.error("Error loading content:", e);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentTopicId, difficulty, practiceMode]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Pre-load broken code in Debug Mode
  useEffect(() => {
    if (!isGymMode && exercise) {
      // Use brokenCode if available, otherwise fallback to removing last char from solution
      const brokenSQL = exercise.brokenCode || exercise.solutionQuery?.slice(0, -1) || '';
      setSqlCode(brokenSQL);
    }
  }, [exercise, isGymMode]);


  const handleResetInput = () => {
    setUserResult(null);
    setValidation(null);
    setShowHint(false);
    setShowErrorExplanation(false);
    setSqlCode("");
    setShowSolution(false);
    setShowStatsModal(false); // Close stats modal on reset
  };

  const formatSQL = () => {
    try {
      const formatted = format(sqlCode, {
        language: "sql",
        tabWidth: 2,
        keywordCase: "upper",
      });
      setSqlCode(formatted);
    } catch (error) {
      // If formatting fails, keep original code
      console.error("Format error:", error);
    }
  };

  const handleShuffle = () => {
    loadContent();
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      handleResetInput();
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      handleResetInput();
    }
  };

  const handleRun = useCallback(() => {
    if (!isDbReady) {
      console.error("Database not ready");
      return;
    }

    // Prevent execution of empty query
    if (!sqlCode || sqlCode.trim() === "") {
      setUserResult({
        success: false,
        error: "Query vuota",
        data: [],
        message: "Scrivi una query SQL prima di eseguire",
      });
      return;
    }

    setShowErrorExplanation(false);
    setShowStatsModal(false); // Close stats modal on new run

    // Execute the query for both Gym and Debug modes
    const res = runQuery(sqlCode);
    setUserResult(res);

    // Add to history if successful
    if (res.success) {
      setQueryHistory((prev) => {
        // Remove duplicates of current query, add to front, keep max 5
        const newHistory = [
          sqlCode,
          ...prev.filter((q) => q !== sqlCode),
        ].slice(0, 5);
        return newHistory;
      });
    }

    // Validate if in Gym or Debug mode
    if (exercise) {
      if (exercise.solutionQuery) {
        const solutionRes = runQuery(exercise.solutionQuery);
        // Normalize solution data to always be an array
        let solutionData = Array.isArray(solutionRes.data)
          ? solutionRes.data
          : solutionRes.data
          ? [solutionRes.data]
          : [];

        // Sanitize undefined values to prevent crashes
        const sanitizedData = solutionData.map((row) => {
          const sanitized: any = {};
          for (const key in row) {
            sanitized[key] = row[key] === undefined ? "-" : row[key];
          }
          return sanitized;
        });

        // Store expected result for diff view
        setExpectedResult(sanitizedData);

        if (solutionRes.success) {
          // Use enhanced compareResults for robust validation
          const userRows = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
          const diff = compareResults(userRows, sanitizedData);
          
          // Check if results match (ignoring row order and type differences)
          const isCorrect = diff.missingRows.length === 0 && diff.extraRows.length === 0;
          
          const userRowCount = userRows.length;
          const expectedRowCount = sanitizedData.length;

          let message = "";
          let warningLevel: 'none' | 'yellow' = 'none';
          let warningMessage = "";

          if (isCorrect) {
            // Results are correct!
            if (diff.hasExtraColumns) {
              // Yellow warning: correct data but extra columns (e.g., SELECT *)
              message = "Risultato corretto!";
              warningLevel = 'yellow';
              warningMessage = `Hai selezionato più colonne del necessario (${diff.extraColumns?.join(', ')}). La traccia richiedeva solo colonne specifiche. Prova a evitare SELECT * e seleziona solo le colonne richieste.`;
            } else {
              // Perfect match!
              message = "Risultato perfetto!";
            }
          } else {
            // Results don't match
            message = "Il risultato non coincide.";
            if (userRowCount !== expectedRowCount) {
              message = `Attenzione: Hai estratto ${userRowCount} righe, ma ne erano attese ${expectedRowCount}.`;
            }
          }

          setValidation({
            isCorrect,
            userRowCount,
            expectedRowCount,
            message,
            warningLevel,
            warningMessage,
          });
        } else {
          // Query succeeded but solution query failed - still show results
          setValidation({
            isCorrect: false,
            userRowCount: Array.isArray(res.data) ? res.data.length : 0,
            expectedRowCount: 0,
            message:
              "Query eseguita con successo, ma impossibile validare la soluzione.",
          });
        }
      } else {
        // No solution to compare - just show results
        setValidation(null);
      }
    } else {
      // Not in Gym mode or no exercise - clear validation
      setValidation(null);
    }
  }, [sqlCode, exercise, practiceMode, isDbReady, isGymMode]);

  const filteredTopics = useMemo(() => {
    return TOPICS.filter(
      (t) =>
        t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (isLoading && !exercise) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-bg text-slate-500">
        Caricamento...
      </div>
    );
  }

  const selectionClass = isGymMode
    ? "selection:bg-blue-500"
    : "selection:bg-purple-500";

  return (
    <div
      className={`flex h-screen bg-dark-bg text-slate-200 font-sans overflow-hidden ${selectionClass} selection:text-white`}
    >
      {/* LEFT SIDEBAR */}
      {isGymMode && (
        <aside className="w-64 bg-[#0b1120] border-r border-slate-800 flex flex-col shrink-0 z-20 shadow-2xl">
          <div className="h-16 flex items-center px-4 border-b border-slate-800 gap-2 bg-[#0b1120]">
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              aria-label="Torna alla home"
            >
              <HomeIcon size={18} />
            </button>
            <div className="font-black tracking-tighter text-lg flex items-center gap-2 select-none">
              <span className="text-slate-100">SQL</span>
              <span className={textActive}>LAB</span>
            </div>
          </div>

          <div className="p-3 border-b border-slate-800/50 bg-[#0b1120]">
            <div className="relative group">
              <Search
                size={14}
                className={`absolute left-3 top-2.5 text-slate-500 ${
                  isGymMode
                    ? "group-focus-within:text-blue-400"
                    : "group-focus-within:text-purple-400"
                } transition-colors`}
              />
              <input
                type="text"
                placeholder="Cerca argomento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-slate-900/50 border border-slate-800 rounded text-sm py-2 pl-9 pr-3 text-slate-200 focus:outline-none ${focusBorderTheme} focus:bg-slate-900 transition-all placeholder-slate-600`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5 custom-scrollbar bg-[#0b1120]">
            {filteredTopics.map((topic) => {
              const isActive = currentTopicId === topic.id;
              const Icon = topic.icon || Database;
              const badges = topic.subtitle
                ? topic.subtitle.split(",").map((s) => s.trim())
                : [];

              return (
                <button
                  key={topic.id}
                  onClick={() => setCurrentTopicId(topic.id)}
                  className={`w-full relative group rounded-xl overflow-hidden transition-all duration-300 hover:pl-2 ${
                    isActive
                      ? `bg-gradient-to-r ${bgThemeGradient} to-transparent border-l-4 ${borderActive}`
                      : "hover:bg-slate-800/50 border-l-4 border-transparent"
                  }`}
                >
                  <div className={`relative px-4 py-3 flex items-start gap-3`}>
                    <Icon
                      size={18}
                      className={`shrink-0 mt-0.5 transition-colors duration-300 ${
                        isActive
                          ? `${textActive} drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]`
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                    <div className="text-left flex flex-col min-w-0 w-full">
                      <span
                        className={`block text-sm font-bold transition-colors duration-300 truncate ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      >
                        {topic.label}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {badges.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                              isActive
                                ? "bg-black/40 text-slate-300"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800 bg-[#0b1120] space-y-2">
            <button
              onClick={() => setShowDbPanel(!showDbPanel)}
              className="w-full flex items-center justify-between px-4 py-2 bg-slate-800/50 rounded border border-slate-700 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-all active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Database size={16} /> Database
              </span>
              <ChevronRight
                size={14}
                className={`transition-transform duration-300 ${
                  showDbPanel ? "rotate-90" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setShowERDiagram(true)}
              className="w-full flex items-center justify-between px-4 py-2 bg-blue-900/20 rounded border border-blue-700/50 text-sm text-blue-300 hover:text-white hover:border-blue-500 hover:bg-blue-900/30 transition-all active:scale-95"
            >
              <span className="flex items-center gap-2">
                <GitBranch size={16} /> Mostra Schema DB
              </span>
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                ER
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* DB PANEL */}
      {isGymMode && showDbPanel && (
        <div className="w-80 bg-[#0f172a] border-r border-slate-800 shrink-0 flex flex-col z-30 shadow-2xl animate-in slide-in-from-left duration-200">
          <div className="p-4 border-b border-slate-800 font-bold text-sm flex items-center gap-2 text-slate-300">
            <Layers size={16} className={textActive} /> Schema Database
          </div>
          <div className="flex-1 overflow-auto p-4 bg-[#0f172a]">
            <SchemaViewer schemas={DB_SCHEMAS} />
          </div>
        </div>
      )}

      {/* ER Diagram Modal */}
      {showERDiagram && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
          <div className="relative z-50 w-full max-w-5xl max-h-[90vh]">
            <SchemaERDiagram
              schemas={DB_SCHEMAS}
              onClose={() => setShowERDiagram(false)}
            />
          </div>
        </div>
      )}

      {/* MAIN AREA */}
      <main 
        key={practiceMode} // Trigger animation on mode change
        className={`flex-1 flex flex-col min-w-0 bg-[#0f172a] animate-in slide-in-from-${isGymMode ? 'left' : 'right'}-10 fade-in duration-500 ease-out`}
      >
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/95 backdrop-blur z-10">
          <div className="flex items-center gap-4 w-full">
            {!isGymMode && (
              <button
                onClick={onBack}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded"
                aria-label="Torna alla home"
              >
                <HomeIcon size={18} />
              </button>
            )}

            {/* SLIDING PILL FOR MODE */}
            <div className="relative flex bg-slate-900/80 rounded-xl p-1.5 border border-slate-800 w-48 shadow-inner backdrop-blur-sm">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg shadow-lg shadow-black/20 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                  isGymMode
                    ? "left-1.5 bg-gradient-to-br from-blue-500 to-blue-600"
                    : "left-[calc(50%+0px)] translate-x-0 bg-gradient-to-br from-purple-500 to-purple-600"
                }`}
              ></div>
              <button
                onClick={() => setPracticeMode(PracticeMode.Solve)}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase ${
                  isGymMode
                    ? "text-white text-shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Dumbbell size={14} strokeWidth={2.5} /> GYM
              </button>
              <button
                onClick={() => setPracticeMode(PracticeMode.Type)}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase ${
                  !isGymMode
                    ? "text-white text-shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Bug size={14} strokeWidth={2.5} /> DEBUG
              </button>
            </div>

            {/* SLIDING PILL FOR DIFFICULTY - NOW COLORED */}
            <div className="relative flex bg-slate-900 rounded-lg p-1 border border-slate-800 ml-4 shadow-inner">
              <div
                className={`absolute top-1 bottom-1 rounded shadow-sm transition-all duration-300 ease-out ${
                  difficultyColor.bg
                } ${
                  difficulty === Difficulty.Easy
                    ? "left-1 w-[calc(33.333%-0.5rem)]"
                    : difficulty === Difficulty.Medium
                    ? "left-[calc(33.333%+0.125rem)] w-[calc(33.333%-0.5rem)]"
                    : "left-[66.666%] w-[calc(33.333%-0.25rem)]"
                }`}
              ></div>
              {Object.values(Difficulty).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`relative z-10 px-4 py-1 text-xs font-bold rounded transition-colors min-w-[70px] ${
                    difficulty === d
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* EXERCISE COUNTER */}
            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-1 ml-4 shadow-inner">
              <button
                onClick={handlePrevExercise}
                disabled={currentExerciseIndex === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
                aria-label="Esercizio precedente"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-3 min-w-[4rem] text-center font-mono text-xs font-bold text-slate-300">
                <span className={textActive}>{currentExerciseIndex + 1}</span>{" "}
                <span className="text-slate-600">/</span> {exercises.length}
              </div>
              <button
                onClick={handleNextExercise}
                disabled={currentExerciseIndex === exercises.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
                aria-label="Esercizio successivo"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {isGymMode && (
                <button
                  onClick={handleShuffle}
                  className="group p-2 text-slate-400 hover:text-white transition-all rounded hover:bg-slate-800 border border-transparent hover:border-slate-700 relative"
                  title="Rigenera esercizi"
                >
                  <Shuffle
                    size={18}
                    className="group-active:rotate-180 transition-transform duration-500"
                  />
                  <span className="absolute -bottom-8 right-0 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Rigenera Domande
                  </span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {isGymMode && exercise && (
            <div className="bg-[#111a2e] border-b border-slate-800 px-6 py-6 shrink-0 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1 h-full ${bgActive} shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-colors duration-500`}
              ></div>

              <div className="flex items-start gap-4 relative z-10">
                {/* Topic Icon */}
                <div
                  className={`${bgThemeLight} p-2.5 rounded-lg border ${borderThemeLight} transition-colors duration-500`}
                >
                  {React.createElement(
                    TOPICS.find((t) => t.id === exercise.topicId)?.icon ||
                      Dumbbell,
                    { className: textActive, size: 24 }
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl text-white font-bold mb-2 leading-tight">
                    {exercise?.title}
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
                    {exercise?.description}
                  </p>
                </div>
              </div>

              {(showHint || showSolution) && (
                <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                  {showHint && (
                    <div className="bg-amber-950/30 border-l-2 border-amber-500/50 p-4 rounded-r-lg text-sm text-amber-200 shadow-lg">
                      <strong className="text-amber-400 block text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Lightbulb size={14} /> Suggerimento
                      </strong>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 marker:text-amber-500/50">
                        {exercise?.hints?.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {showSolution && (
                    <div className="bg-purple-950/30 border-l-2 border-purple-500/50 p-4 rounded-r-lg text-sm shadow-lg relative group">
                      <strong className="text-purple-400 block text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Unlock size={14} /> Soluzione
                      </strong>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(exercise?.solutionQuery || "");
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Copia soluzione"
                      >
                        <Code size={14} />
                      </button>
                      <code className="font-mono text-purple-200 block bg-black/30 p-3 rounded border border-purple-500/20 select-all">
                        {exercise?.solutionQuery}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* EDITOR AREA */}
          <div className="flex-1 flex min-h-0">
            {!isGymMode && exercise ? (
              // DEBUG MODE SPLIT
              <>
                <div className="w-1/2 bg-[#0b1120] border-r border-slate-800 p-6 overflow-auto custom-scrollbar">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                      <Bug size={14} /> Modalità Debug
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                      {exercise?.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {exercise?.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Instructions Card */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                      <strong className="block text-slate-400 text-xs uppercase tracking-wider mb-2">
                        Obiettivo
                      </strong>
                      <p className="text-sm text-slate-300">
                        Il codice nell'editor contiene un <span className="text-amber-400 font-bold">errore intenzionale</span>. 
                        Analizza la query, trova il bug e correggilo per ottenere il risultato atteso.
                      </p>
                    </div>

                    {/* Hint Section */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          showHint
                            ? "bg-amber-950/30 border-amber-500/50 text-amber-200"
                            : "bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Lightbulb size={16} className={showHint ? "text-amber-400" : ""} />
                          {showHint ? "Nascondi Indizio" : "Dammi un indizio"}
                        </span>
                        {showHint ? <ChevronRight className="rotate-90" size={16} /> : <ChevronRight size={16} />}
                      </button>
                      
                      {showHint && exercise?.debugHint && (
                        <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-4 animate-in slide-in-from-top-2">
                          <p className="text-sm text-amber-200 flex gap-2">
                            <span className="text-amber-500 font-bold">💡</span>
                            {exercise.debugHint}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Solution Section */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          showSolution
                            ? "bg-purple-950/30 border-purple-500/50 text-purple-200"
                            : "bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Unlock size={16} className={showSolution ? "text-purple-400" : ""} />
                          {showSolution ? "Nascondi Soluzione" : "Mostra Soluzione"}
                        </span>
                        {showSolution ? <ChevronRight className="rotate-90" size={16} /> : <ChevronRight size={16} />}
                      </button>

                      {showSolution && (
                        <div className="bg-purple-950/20 border border-purple-500/20 rounded-lg p-4 animate-in slide-in-from-top-2 relative group">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(exercise?.solutionQuery || "");
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Copia soluzione"
                          >
                            <Code size={14} />
                          </button>
                          <code className="font-mono text-sm text-purple-200 block whitespace-pre-wrap">
                            {exercise?.solutionQuery}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col bg-[#0f172a] min-h-0">
                  {/* Toolbar */}
                  <div className="bg-slate-900/50 p-2 border-b border-slate-800 flex justify-end shrink-0">
                    <button
                      onClick={handleRun}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-md shadow-lg shadow-purple-900/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Play size={14} /> VERIFICA
                    </button>
                  </div>
                  
                  {/* Editor Area */}
                  <div className="flex-shrink min-h-[250px] relative bg-[#0f172a] border-b border-slate-800">
                    <CodeEditor
                      value={sqlCode}
                      onChange={setSqlCode}
                      onRun={handleRun}
                    />
                  </div>
                  
                  {/* Results Area */}
                  <div className="flex-1 overflow-hidden relative bg-[#0b1120] flex flex-col min-h-0">
                    {/* BUG FIX 1: Always show results table for valid SQL, regardless of validation */}
                    {userResult?.success ? (
                      <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="p-2 bg-slate-900/50 text-xs font-bold text-slate-400 border-b border-slate-800 flex items-center gap-2 shrink-0">
                          <TableIcon size={14} />
                          RISULTATO QUERY
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <ResultsTable
                            data={
                              Array.isArray(userResult.data)
                                ? userResult.data
                                : userResult.data
                                ? [userResult.data]
                                : []
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      !userResult?.error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 select-none pointer-events-none">
                          <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center mb-4 border border-slate-800">
                            <Layers size={32} className="opacity-30" />
                          </div>
                          <span className="text-xs uppercase tracking-[0.2em] opacity-40 font-bold">
                            Risultati Query
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Validation Message */}
                  {validation && (
                    <div
                      className={`p-3 border-t border-slate-800 ${
                        validation.isCorrect
                          ? "bg-emerald-900/20 text-emerald-400"
                          : "bg-red-900/20 text-red-400"
                      } text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2 shrink-0`}
                    >
                      {validation.isCorrect ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}{" "}
                      {validation.message}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // GYM MODE SPLIT
              <>
                <div className="w-1/2 border-r border-slate-800 flex flex-col bg-[#0f172a] relative">
                  <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur relative z-20">
                    <div className="flex items-center gap-2">
                      {/* Hint Button */}
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border shadow-sm hover:shadow-md active:scale-95 ${
                          showHint
                            ? "bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-amber-900/30"
                            : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-300"
                        }`}
                      >
                        <Lightbulb
                          size={14}
                          className={showHint ? "fill-amber-300" : ""}
                        />
                        Suggerimento
                      </button>

                      {/* Solution Button */}
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border shadow-sm hover:shadow-md active:scale-95 ${
                          showSolution
                            ? "bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-purple-900/30"
                            : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-300"
                        }`}
                      >
                        {showSolution ? (
                          <Unlock size={14} />
                        ) : (
                          <Lock size={14} />
                        )}
                        Soluzione
                      </button>

                      {/* Separator */}
                      <div className="w-px h-6 bg-slate-700 mx-1"></div>

                      {/* Format SQL Button */}
                      <button
                        onClick={formatSQL}
                        disabled={!sqlCode.trim()}
                        className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border shadow-sm hover:shadow-md active:scale-95 bg-indigo-600/20 border-indigo-500/60 text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-500/80 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600/20"
                        title="Formatta SQL"
                      >
                        <Sparkles size={14} />
                        Formatta
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Execute Button */}
                      <button
                        onClick={handleRun}
                        disabled={!isDbReady}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border shadow-md hover:shadow-lg active:scale-95 ${
                          !isDbReady
                            ? "bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed"
                            : `${bgActive} border-${
                                isGymMode ? "blue" : "purple"
                              }-400/50 text-white hover:opacity-90 shadow-${
                                isGymMode ? "blue" : "purple"
                              }-900/40`
                        }`}
                      >
                        <Play size={14} fill="currentColor" />
                        Esegui
                      </button>

                      {/* Reset Button */}
                      <button
                        onClick={handleResetInput}
                        className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border shadow-sm hover:shadow-md active:scale-95 bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-300"
                      >
                        <RotateCcw size={14} />
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 relative flex flex-col min-h-0">
                    <div className="flex-1 relative">
                      <CodeEditor
                        value={sqlCode}
                        onChange={setSqlCode}
                        onRun={handleRun}
                      />
                    </div>

                    {/* Query History */}
                    {queryHistory.length > 0 && (
                      <div className="bg-[#0b1120] border-t border-slate-800 p-3">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <History size={14} />
                            Cronologia Query
                          </div>
                          <button
                            onClick={() => setQueryHistory([])}
                            className="text-xs px-2 py-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
                            title="Cancella cronologia"
                          >
                            <XCircle size={12} />
                            Cancella
                          </button>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                          {queryHistory.map((query, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSqlCode(query)}
                              className="shrink-0 max-w-[280px] text-xs text-left bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600 rounded-md px-3 py-2 transition-all truncate font-mono shadow-sm hover:shadow-md"
                              title={query}
                            >
                              {query.length > 60
                                ? query.substring(0, 60) + "..."
                                : query}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-1/2 bg-[#0b1120] flex flex-col min-h-0">
                  {validation && (
                    <>
                      <div
                        className={`p-3 border-b border-slate-800 ${
                          validation.isCorrect
                            ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/50"
                            : "bg-red-900/20 text-red-400 border-red-900/50"
                        } flex items-center gap-2 text-sm font-bold shrink-0 animate-in slide-in-from-top-2`}
                      >
                        {validation.isCorrect ? (
                          <CheckCircle2
                            size={18}
                            className="fill-emerald-900/50"
                          />
                        ) : (
                          <XCircle size={18} className="fill-red-900/50" />
                        )}{" "}
                        {validation.message}
                      </div>
                      
                      {/* Yellow warning banner for extra columns */}
                      {validation.warningLevel === 'yellow' && validation.warningMessage && (
                        <div className="p-3 border-b border-amber-800/50 bg-amber-900/20 text-amber-300 flex items-start gap-2 text-xs shrink-0 animate-in slide-in-from-top-2">
                          <AlertTriangle size={16} className="shrink-0 mt-0.5 fill-amber-900/50" />
                          <div className="flex-1 leading-relaxed whitespace-pre-wrap">
                            {validation.warningMessage}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {userResult?.error && (
                    <div className="p-4 bg-red-950/30 border-b border-red-900/50 shrink-0">
                      <div className="text-red-300 text-xs font-mono mb-3 flex items-start gap-2 bg-black/20 p-2 rounded border border-red-900/30">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        {userResult.error}
                      </div>
                      <button
                        onClick={() =>
                          setShowErrorExplanation(!showErrorExplanation)
                        }
                        className="text-xs font-bold flex items-center gap-1.5 text-white bg-red-600/80 hover:bg-red-500 px-3 py-1.5 rounded-md transition-colors shadow-lg shadow-red-900/20"
                      >
                        <Bot size={14} /> Spiega Errore con AI
                      </button>
                      {showErrorExplanation && (
                        <div className="mt-3 p-4 bg-[#0f172a] rounded-lg border border-red-800/50 text-red-200 text-sm leading-relaxed animate-in fade-in shadow-xl">
                          <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                            Diagnosi:
                          </div>
                          {explainSqlError(userResult.error, sqlCode)}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden relative bg-[#0b1120] flex flex-col">
                    {/* BUG FIX 1: Always show results table for valid SQL, regardless of validation */}
                    {userResult?.success ? (
                      // Show results table whenever query executed successfully (even if results don't match expected)
                        <div className="flex-1 overflow-hidden flex flex-col">
                          {/* Toolbar with CSV Download and Stats Button */}
                          <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex justify-end gap-2">
                            {/* Stats Button */}
                            <button
                              onClick={() => setShowStatsModal(true)}
                              className="px-4 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 shadow-sm active:scale-95 bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30"
                              title="Visualizza statistiche rapide"
                            >
                              <TrendingUp size={14} />
                              Statistiche
                            </button>
                            
                            {/* CSV Download Button */}
                            <button
                              onClick={() =>
                                downloadCSV(
                                  Array.isArray(userResult.data)
                                    ? userResult.data
                                    : [],
                                  `sql_result_${Date.now()}.csv`
                                )
                              }
                              className="px-4 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 shadow-sm active:scale-95 bg-emerald-600/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/30"
                              title="Scarica risultati in CSV"
                            >
                              <Download size={14} />
                              Scarica CSV
                            </button>
                          </div>

                          <div className="flex-1 overflow-hidden">
                            <ErrorBoundary>
                              <ResultsTable
                                data={
                                  Array.isArray(userResult.data)
                                    ? userResult.data
                                    : userResult.data
                                    ? [userResult.data]
                                    : []
                                }
                              />
                            </ErrorBoundary>
                          </div>
                        </div>
                    ) : (
                      !userResult?.error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 select-none pointer-events-none">
                          <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center mb-4 border border-slate-800">
                            <Layers size={32} className="opacity-30" />
                          </div>
                          <span className="text-xs uppercase tracking-[0.2em] opacity-40 font-bold">
                            Risultati Query
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Stats Modal */}
      {showStatsModal && userResult?.success && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowStatsModal(false)}
        >
          <div
            className="relative bg-[#0b1120] border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-auto animate-in zoom-in-95 duration-300 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0b1120]">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-400" />
                <h2 className="text-lg font-bold text-white">Statistiche Rapide</h2>
                <span className="text-xs text-slate-500">
                  ({
                    Array.isArray(userResult.data)
                      ? userResult.data.length
                      : userResult.data
                      ? 1
                      : 0
                  } righe analizzate)
                </span>
              </div>
              <button
                onClick={() => setShowStatsModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Chiudi"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <ResultStats
                data={
                  Array.isArray(userResult.data)
                    ? userResult.data
                    : userResult.data
                    ? [userResult.data]
                    : []
                }
                query={sqlCode}
              />
            </div>
          </div>
        </div>
      )}
      {/* ER Diagram Modal */}
      {showERDiagram && (
        <SchemaERDiagram
          schemas={DB_SCHEMAS}
          onClose={() => setShowERDiagram(false)}
        />
      )}
    </div>
  );
};

export default SqlGym;
