import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import { formatSQL } from "../utils/formatSQL";
import { TableInfo } from "../utils/ghostTextSuggestions";
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
import TableInspectorModal from "./TableInspectorModal";

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
  const [inspectorTable, setInspectorTable] = useState<typeof DB_SCHEMAS[0] | null>(null);
  
  // Refs for sliding effect
  const itemsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [activeTopicStyle, setActiveTopicStyle] = useState({ top: 0, height: 0, opacity: 0 });



  const isGymMode = practiceMode === PracticeMode.Solve;

  // --- DYNAMIC THEME COLORS ---
  const themeColor = isGymMode ? "blue" : "purple";
  const bgActive = isGymMode ? "bg-blue-600" : "bg-purple-600";
  const textActive = isGymMode ? "text-blue-300" : "text-purple-300";
  const borderActive = isGymMode ? "border-blue-400" : "border-purple-400";
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

  const handleFormatSQL = () => {
    const formatted = formatSQL(sqlCode);
    setSqlCode(formatted);
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

  useEffect(() => {
    const activeElement = itemsRef.current[currentTopicId];
    if (activeElement) {
      setActiveTopicStyle({
        top: activeElement.offsetTop,
        height: activeElement.offsetHeight,
        opacity: 1,
      });
    } else {
      setActiveTopicStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [currentTopicId, filteredTopics]);

  const tableInfos: TableInfo[] = useMemo(() => {
    return DB_SCHEMAS.map(schema => ({
      tableName: schema.tableName,
      columns: schema.columns.map(col => col.name)
    }));
  }, []);

  if (isLoading && !exercise) {
    return (
      <div className="h-screen flex items-center justify-center bg-transparent text-slate-300">
        Caricamento...
      </div>
    );
  }

  const selectionClass = isGymMode
    ? "selection:bg-blue-500"
    : "selection:bg-purple-500";

  return (
    <div
      className={`flex h-screen bg-transparent text-slate-200 font-sans overflow-hidden ${selectionClass} selection:text-white`}
    >
      <div className="flex flex-1 gap-5">
      {/* LEFT SIDEBAR */}
      {isGymMode && (
        <aside className="w-64 bg-[#121212]/70 backdrop-blur-xl rounded-3xl flex flex-col shrink-0 z-20 h-[calc(100vh-3.25rem)] mt-7 ml-6">
          <div className="h-16 flex items-center px-4 gap-2">
            <button
              onClick={onBack}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Torna alla home"
            >
              <HomeIcon size={18} />
            </button>
            <div className="font-black tracking-tighter text-lg flex items-center gap-2 select-none">
              <span className="text-white">SQL</span>
              <span className={textActive}>LAB</span>
            </div>
          </div>

          <div className="p-3">
            <div className="relative group">
              <Search
                size={14}
                className={`absolute left-3 top-2.5 text-zinc-500 ${
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
                className={`w-full bg-black/20 ring-1 ring-black/20 inset rounded-xl text-sm py-2 pl-9 pr-3 text-slate-200 focus:outline-none focus:bg-black/40 transition-all placeholder-slate-500`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5 custom-scrollbar relative">
            {/* SLIDING BACKGROUND */}
            <div
              className={`absolute left-2 right-2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] pointer-events-none z-0 ${
                isGymMode
                  ? "bg-gradient-to-b from-blue-500/30 to-blue-600/5 border border-white/15 shadow-[0_0_15px_rgba(59,130,246,0.3)_inset] shadow-blue-500/20"
                  : "bg-gradient-to-b from-purple-500/30 to-purple-600/5 border border-white/15 shadow-[0_0_15px_rgba(168,85,247,0.3)_inset] shadow-purple-500/20"
              } backdrop-blur-xl`}
              style={{
                top: activeTopicStyle.top,
                height: activeTopicStyle.height,
                opacity: activeTopicStyle.opacity,
              }}
            />
            {filteredTopics.map((topic) => {
              const isActive = currentTopicId === topic.id;
              const Icon = topic.icon || Database;
              const badges = topic.subtitle
                ? topic.subtitle.split(",").map((s) => s.trim())
                : [];

                return (
                  <button
                    key={topic.id}
                    ref={(el) => { itemsRef.current[topic.id] = el; }}
                    onClick={() => setCurrentTopicId(topic.id)}
                    className={`w-full relative group rounded-xl overflow-hidden transition-all duration-300 hover:pl-2 z-10 outline-none focus:outline-none ${
                      isActive ? "shadow-lg shadow-black/40" : "hover:bg-slate-800/50"
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
                            : "text-slate-300 group-hover:text-slate-200"
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

          <div className="p-4 space-y-2">
            <button
              onClick={() => setShowDbPanel(!showDbPanel)}
              className="w-full flex items-center justify-between px-4 py-2 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/5 rounded-xl text-sm text-slate-300 hover:text-white transition-all active:scale-95 shadow-md shadow-black/20"
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
              className="w-full flex items-center justify-between px-4 py-2 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/5 rounded-xl text-sm text-slate-300 hover:text-white transition-all active:scale-95 shadow-md shadow-black/20"
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
        <div className="w-80 bg-[#121212]/70 backdrop-blur-xl rounded-2xl shrink-0 flex flex-col z-30 h-[calc(100vh-3.25rem)] mt-7 mb-3 animate-in slide-in-from-left duration-200">
          <div className="p-4 font-bold text-sm flex items-center gap-2 text-slate-200">
            <Layers size={16} className={textActive} /> Schema Database
          </div>
          <div className="flex-1 overflow-auto p-4">
            <SchemaViewer schemas={DB_SCHEMAS} onInspect={setInspectorTable} />
          </div>
        </div>
      )}

      {/* ER Diagram Modal */}
      {showERDiagram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
          <div className="relative z-50 w-full max-w-5xl max-h-[70vh] flex flex-col">
            <SchemaERDiagram
              schemas={DB_SCHEMAS}
              onClose={() => setShowERDiagram(false)}
            />
          </div>
        </div>
      )}

      {/* Table Inspector Modal */}
      {inspectorTable && (
        <TableInspectorModal
          tableName={inspectorTable.tableName}
          schema={inspectorTable}
          onClose={() => setInspectorTable(null)}
        />
      )}

      {/* MAIN AREA */}
      <main
        key={practiceMode} // Trigger animation on mode change
        className={`flex-1 flex flex-col min-w-0 animate-in slide-in-from-${isGymMode ? 'left' : 'right'}-10 fade-in duration-500 ease-out h-full pr-6 ${!isGymMode ? 'pl-6' : ''}`}
      >
        <header className="h-16 flex items-center justify-between mt-4 mb-1 z-10 shrink-0">
          <div className="flex items-center gap-2 w-full">
            {!isGymMode && (
              <button
                onClick={onBack}
                className="h-[42px] w-[42px] flex items-center justify-center text-slate-300 hover:text-white bg-[#121212]/70 backdrop-blur-xl rounded-xl shadow-lg shadow-black/20 hover:bg-white/5 transition-all active:scale-95"
                aria-label="Torna alla home"
              >
                <HomeIcon size={18} />
              </button>
            )}

            {/* SLIDING PILL FOR MODE */}
            <div className="relative flex bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg shadow-lg transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                  isGymMode
                    ? "left-1.5 bg-gradient-to-b from-blue-500/30 to-blue-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(59,130,246,0.2)_inset] shadow-blue-500/20"
                    : "left-[calc(50%+0px)] translate-x-0 bg-gradient-to-b from-purple-500/30 to-purple-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(168,85,247,0.2)_inset] shadow-purple-500/20"
                }`}
              ></div>
              <button
                onClick={() => setPracticeMode(PracticeMode.Solve)}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase ${
                  isGymMode
                    ? "text-white text-shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Dumbbell size={14} strokeWidth={2.5} /> GYM
              </button>
              <button
                onClick={() => setPracticeMode(PracticeMode.Type)}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase ${
                  !isGymMode
                    ? "text-white text-shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bug size={14} strokeWidth={2.5} /> DEBUG
              </button>
            </div>

            {/* SEPARATOR */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1"></div>

            {/* SLIDING PILL FOR DIFFICULTY - NOW COLORED */}
            <div className="relative flex bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20">
              <div
                className={`absolute top-1.5 bottom-1.5 rounded-lg shadow-lg transition-all duration-300 ease-out ${
                  difficulty === Difficulty.Easy
                    ? "left-1.5 w-[calc(33.333%-0.5rem)] bg-gradient-to-b from-green-500/30 to-green-600/5 border border-white/15 shadow-[0_0_15px_rgba(34,197,94,0.2)_inset] shadow-green-600/20"
                    : difficulty === Difficulty.Medium
                    ? "left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.5rem)] bg-gradient-to-b from-orange-500/30 to-orange-600/5 border border-white/15 shadow-[0_0_15px_rgba(249,115,22,0.2)_inset] shadow-orange-600/20"
                    : "left-[66.666%] w-[calc(33.333%-0.375rem)] bg-gradient-to-b from-red-500/30 to-red-600/5 border border-white/15 shadow-[0_0_15px_rgba(239,68,68,0.2)_inset] shadow-red-600/20"
                }`}
              ></div>
              {Object.values(Difficulty).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`relative z-10 px-4 py-2 text-xs font-bold rounded-lg transition-colors min-w-[70px] ${
                    difficulty === d
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* SEPARATOR */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1"></div>

            {/* EXERCISE COUNTER */}
            <div className="flex items-center bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20">
              <button
                onClick={handlePrevExercise}
                disabled={currentExerciseIndex === 0}
                className="py-2 px-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Esercizio precedente"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-3 min-w-[4rem] text-center font-mono text-xs font-bold text-slate-300">
                <span className={textActive}>{currentExerciseIndex + 1}</span>{" "}
                <span className="text-slate-500">/</span> {exercises.length}
              </div>
              <button
                onClick={handleNextExercise}
                disabled={currentExerciseIndex === exercises.length - 1}
                className="py-2 px-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Esercizio successivo"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* SHUFFLE BUTTON */}
            <div className="ml-auto flex items-center bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20">
              <button
                onClick={handleShuffle}
                title="Cambia esercizio"
                className="py-2 px-3 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-2 group"
              >
                <Shuffle
                  size={16}
                  className="group-active:rotate-180 transition-transform duration-500"
                />
                <span className="text-xs font-bold">Shuffle</span>
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {isGymMode && exercise && (
            <div className="bg-[#121212]/70 backdrop-blur-xl rounded-2xl px-6 py-4 shrink-0 relative overflow-hidden mb-3">
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
                  <p className="text-slate-200 text-sm leading-relaxed max-w-4xl">
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
                      <ul className="list-disc list-inside space-y-1 text-slate-200 marker:text-amber-500/50">
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
          <div className="flex-1 flex min-h-0 pb-6 gap-4">
            {!isGymMode && exercise ? (
              // DEBUG MODE SPLIT
              <>
                <div className="w-1/2 flex flex-col gap-4 min-h-0">
                  <div className="bg-[#121212]/70 backdrop-blur-xl rounded-2xl p-6 shrink-0">
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <Bug size={14} /> Modalità Debug
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {exercise?.title}
                      </h3>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {exercise?.description}
                      </p>
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-black/20 ring-1 ring-black/20 inset rounded-xl p-3 mb-4">
                      <strong className="block text-slate-300 text-xs uppercase tracking-wider mb-1">
                        Obiettivo
                      </strong>
                      <p className="text-sm text-slate-200">
                        Il codice nell'editor contiene un <span className="text-amber-400 font-bold">errore intenzionale</span>. 
                        Analizza la query, trova il bug e correggilo.
                      </p>
                    </div>

                    {/* Control Bar - Grouped Buttons */}
                    <div className="flex items-center gap-2">
                       {/* Hint Button */}
                       <button
                        onClick={() => setShowHint(!showHint)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-md ${
                          showHint
                            ? "bg-gradient-to-b from-amber-500/30 to-amber-600/5 backdrop-blur-xl border border-white/5 shadow-[0_0_15px_rgba(245,158,11,0.2)_inset] shadow-amber-500/10 text-amber-300"
                            : "bg-[#121212]/70 backdrop-blur-xl text-slate-300 hover:bg-white/5 hover:text-slate-200 shadow-black/20"
                        }`}
                      >
                        <Lightbulb
                          size={14}
                          className={showHint ? "fill-amber-300" : ""}
                        />
                        Indizio
                      </button>

                      {/* Solution Button */}
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-md ${
                          showSolution
                            ? "bg-gradient-to-b from-purple-500/30 to-purple-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(168,85,247,0.2)_inset] shadow-purple-500/10 text-purple-300"
                            : "bg-[#121212]/70 backdrop-blur-xl text-slate-300 hover:bg-white/5 hover:text-slate-200 shadow-black/20"
                        }`}
                      >
                        {showSolution ? (
                          <Unlock size={14} />
                        ) : (
                          <Lock size={14} />
                        )}
                        Soluzione
                      </button>

                      {/* Execute Button - Moved here */}
                      <button
                        onClick={handleRun}
                        disabled={!isDbReady}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg ${
                          !isDbReady
                            ? "bg-[#0a0a0a]/80 text-slate-400 cursor-not-allowed shadow-black/20"
                            : "bg-purple-600 text-white hover:opacity-90 backdrop-blur-xl shadow-purple-600/20"
                        }`}
                      >
                        <Play size={14} fill="currentColor" />
                        VERIFICA
                      </button>
                    </div>

                    {/* Hints & Solution Display Area */}
                    {(showHint || showSolution) && (
                      <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                         {showHint && exercise?.debugHint && (
                          <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-3">
                            <p className="text-sm text-amber-200 flex gap-2">
                              <span className="text-amber-500 font-bold">💡</span>
                              {exercise.debugHint}
                            </p>
                          </div>
                        )}
                        
                        {showSolution && (
                          <div className="bg-purple-950/20 border border-purple-500/20 rounded-lg p-3 relative group">
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
                    )}
                  </div>

                  {/* Editor Area - Moved to Left Column */}
                  <div className="flex-1 min-h-[200px] relative bg-black/20 ring-1 ring-black/20 inset rounded-2xl overflow-hidden">
                    <CodeEditor
                      value={sqlCode}
                      onChange={setSqlCode}
                      onRun={handleRun}
                      tables={tableInfos}
                    />
                  </div>
                </div>

                {/* Right Column - Results Only */}
                <div className="w-1/2 flex flex-col min-h-0 gap-4">
                   {/* Validation Message */}
                  {validation && (
                    <div
                      className={`p-3 rounded-xl border ${
                        validation.isCorrect
                          ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/50"
                          : "bg-red-900/20 text-red-400 border-red-900/50"
                      } text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 shrink-0 shadow-lg`}
                    >
                      {validation.isCorrect ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}{" "}
                      {validation.message}
                    </div>
                  )}

                  {/* Error Message */}
                  {userResult?.error && (
                    <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl shrink-0 shadow-lg">
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
                        <div className="mt-3 p-4 bg-red-950/20 rounded-lg border border-red-800/50 text-red-200 text-sm leading-relaxed animate-in fade-in shadow-xl">
                          <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                            Diagnosi:
                          </div>
                          {explainSqlError(userResult.error, sqlCode)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Results Table */}
                  <div className="flex-1 overflow-hidden relative bg-[#121212]/70 backdrop-blur-xl rounded-2xl flex flex-col shadow-lg">
                    {userResult?.success ? (
                      <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="p-2 bg-[#0a0a0a]/60 text-xs font-bold text-slate-300 flex items-center gap-2 shrink-0 rounded-t-2xl border-b border-white/15">
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
                </div>
              </>
            ) : (
              // GYM MODE SPLIT
              <>
                <div className="w-1/2 flex flex-col relative gap-4">
                  <div className="flex items-center justify-between p-3 bg-[#121212]/70 backdrop-blur-xl rounded-2xl relative z-20 shadow-lg shadow-black/20">
                    <div className="flex items-center gap-2">
                      {/* Hint Button */}
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md ${
                          showHint
                            ? "bg-gradient-to-b from-amber-500/30 to-amber-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(245,158,11,0.2)_inset] shadow-amber-500/10 text-amber-300"
                            : "bg-[#121212]/70 backdrop-blur-xl text-slate-300 hover:bg-white/5 hover:text-slate-200 shadow-black/20"
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
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md ${
                          showSolution
                            ? "bg-gradient-to-b from-purple-500/30 to-purple-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(168,85,247,0.2)_inset] shadow-purple-500/10 text-purple-300"
                            : "bg-[#121212]/70 backdrop-blur-xl text-slate-300 hover:bg-white/5 hover:text-slate-200 shadow-black/20"
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
                        onClick={handleFormatSQL}
                        disabled={!sqlCode.trim()}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md ${
                          "bg-gradient-to-b from-blue-500/30 to-blue-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(59,130,246,0.2)_inset] shadow-blue-500/10 text-blue-300"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
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
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg ${
                          !isDbReady
                            ? "bg-[#0a0a0a]/80 text-slate-400 cursor-not-allowed shadow-black/20"
                            : `${bgActive} text-white hover:opacity-90 backdrop-blur-xl ${shadowActive}`
                        }`}
                      >
                        <Play size={14} fill="currentColor" />
                        Esegui
                      </button>

                      {/* Reset Button */}
                      <button
                        onClick={handleResetInput}
                        className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 bg-[#121212]/70 backdrop-blur-xl text-slate-300 hover:bg-white/5 hover:text-slate-200 shadow-md shadow-black/20 active:bg-red-500/20 active:text-red-300 active:shadow-red-500/20"
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
                        tables={tableInfos}
                      />
                    </div>

                    {/* Query History */}
                    {queryHistory.length > 0 && (
                      <div className="bg-[#121212]/70 backdrop-blur-md rounded-xl p-3 mt-4">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                            <History size={14} />
                            Cronologia Query
                          </div>
                          <button
                            onClick={() => setQueryHistory([])}
                            className="text-xs px-2 py-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
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
                              className="shrink-0 max-w-[280px] text-xs text-left bg-[#121212]/70 backdrop-blur-xl hover:bg-white/5 text-slate-300 hover:text-slate-200 rounded-lg px-3 py-2 transition-all truncate font-mono shadow-md shadow-black/20"
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
                <div className="w-1/2 flex flex-col min-h-0 gap-4">
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
                        <div className="mt-3 p-4 bg-red-950/20 rounded-lg border border-red-800/50 text-red-200 text-sm leading-relaxed animate-in fade-in shadow-xl">
                          <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                            Diagnosi:
                          </div>
                          {explainSqlError(userResult.error, sqlCode)}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden relative bg-[#121212]/70 backdrop-blur-xl rounded-2xl flex flex-col shadow-lg">
                    {/* BUG FIX 1: Always show results table for valid SQL, regardless of validation */}
                    {userResult?.success ? (
                      // Show results table whenever query executed successfully (even if results don't match expected)
                        <div className="flex-1 overflow-hidden flex flex-col">
                          {/* Toolbar with CSV Download and Stats Button */}
                          <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex justify-end gap-2">
                            {/* Stats Button */}
                            <button
                              onClick={() => setShowStatsModal(true)}
                              className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 active:scale-95 bg-gradient-to-b from-blue-500/30 to-blue-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(59,130,246,0.2)_inset] shadow-blue-500/10 text-blue-300 hover:from-blue-500/40 hover:to-blue-600/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)_inset]"
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
                              className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 active:scale-95 bg-gradient-to-b from-emerald-500/30 to-emerald-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(16,185,129,0.2)_inset] shadow-emerald-500/10 text-emerald-300 hover:from-emerald-500/40 hover:to-emerald-600/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)_inset]"
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
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121212]/70 backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4 overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-400" />
                <h2 className="text-lg font-bold text-white">Statistiche Rapide</h2>
                <span className="text-xs text-slate-400">
                  ({
                    Array.isArray(userResult?.data)
                      ? userResult.data.length
                      : userResult?.data
                      ? 1
                      : 0
                  } righe analizzate)
                </span>
              </div>
              <button
                onClick={() => setShowStatsModal(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Chiudi"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-auto custom-scrollbar">
              <ResultStats
                data={
                  Array.isArray(userResult?.data)
                    ? userResult.data
                    : userResult?.data
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
    </div>
  );
};

export default SqlGym;
