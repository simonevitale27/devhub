import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lightbulb,
  Eye,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Terminal,
  Code2,
  Bug,
  Loader2,
  Hash,
  Type,
  GitBranch,
  Repeat,
  List,
  Layers,
  Database,
  Book,
  AlertTriangle,
  Minus,
  Home as HomeIcon,
  Search,
  Dumbbell,
  SearchCode,
  TrendingUp,
} from "lucide-react";

import { Difficulty, Page } from "../types";
import {
  PythonTopicId,
  PythonExercise,
  PYTHON_TOPICS,
  PythonValidationResult,
} from "../pythonTypes";
import { generatePythonExercises } from "../services/pythonExerciseGenerator";
import {
  runPython,
  initPyodide,
  isPyodideReady,
  validateOutput,
} from "../services/pythonService";
import { recordCompletion } from "../services/progressService";
import AutocompleteDropdown, { AutocompleteItem } from "./AutocompleteDropdown";
import { PYTHON_KEYWORDS, PYTHON_BUILTINS, PYTHON_SNIPPETS } from "../utils/pythonConstants";
import UserBadge from "./UserBadge";

// Indent rainbow colors
const INDENT_COLORS = [
  'rgba(255, 179, 71, 0.07)',   // amber
  'rgba(147, 112, 219, 0.07)', // purple
  'rgba(72, 209, 204, 0.07)',  // teal
  'rgba(255, 99, 132, 0.07)',  // pink
];

// Topic icons mapping
const TOPIC_ICONS: Record<PythonTopicId, React.ReactNode> = {
  [PythonTopicId.Operators]: <Hash size={18} />,
  [PythonTopicId.InputOutput]: <Terminal size={18} />,
  [PythonTopicId.Conditions]: <GitBranch size={18} />,
  [PythonTopicId.Loops]: <Repeat size={18} />,
  [PythonTopicId.Collections]: <Layers size={18} />,
  [PythonTopicId.Lists]: <List size={18} />,
  [PythonTopicId.Tuples]: <Database size={18} />,
  [PythonTopicId.Sets]: <Layers size={18} />,
  [PythonTopicId.Dictionaries]: <Book size={18} />,
};

interface PythonGymProps {
  onBack: () => void;
  onNavigate?: (page: Page) => void;
}

type PracticeMode = "solve" | "debug";

const PythonGym: React.FC<PythonGymProps> = ({ onBack, onNavigate }) => {
  // State
  const [selectedTopic, setSelectedTopic] = useState<PythonTopicId>(
    PythonTopicId.Operators
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    Difficulty.Easy
  );
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("solve");
  const [exercises, setExercises] = useState<PythonExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  
  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([]);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState(0);
  
  // Syntax error detection
  const [syntaxErrors, setSyntaxErrors] = useState<Array<{line: number; message: string}>>([]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [validationResult, setValidationResult] =
    useState<PythonValidationResult | null>(null);
  const [currentLineNumber, setCurrentLineNumber] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  // Panel state for Output/Errors
  const [activePanel, setActivePanel] = useState<'output' | 'errors'>('output');
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelHeight, setPanelHeight] = useState(200);
  const [errorOutput, setErrorOutput] = useState<string>("");
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);

  // Animation Refs & State
  const itemsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [activeTopicStyle, setActiveTopicStyle] = useState({ top: 0, height: 0, opacity: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  const isGymMode = practiceMode === "solve";
  
  // Dynamic Theme Colors
  const themeColor = isGymMode ? "blue" : "purple";
  const bgActive = isGymMode ? "bg-blue-600" : "bg-purple-600";
  const textActive = isGymMode ? "text-blue-300" : "text-purple-300";
  const borderActive = isGymMode ? "border-blue-400" : "border-purple-400";
  const shadowActive = isGymMode ? "shadow-blue-600/20" : "shadow-purple-600/20";

  // Difficulty Colors
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

  // Current exercise
  const currentExercise = exercises[currentExerciseIndex];

  // Initialize Pyodide on mount
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        setPyodideLoading(true);
        setPyodideError(null);
        await initPyodide();
        setPyodideLoading(false);
      } catch (error: any) {
        setPyodideError(
          error.message || "Errore durante il caricamento di Python"
        );
        setPyodideLoading(false);
      }
    };
    loadPyodide();
  }, []);

  // Load exercises when topic/difficulty changes
  useEffect(() => {
    const newExercises = generatePythonExercises(
      selectedTopic,
      selectedDifficulty,
      20
    );
    setExercises(newExercises);
    setCurrentExerciseIndex(0);
  }, [selectedTopic, selectedDifficulty]);

  // Update user code when exercise changes
  useEffect(() => {
    if (currentExercise) {
      if (practiceMode === "solve") {
        setUserCode(currentExercise.starterCode);
      } else {
        setUserCode(currentExercise.brokenCode || currentExercise.starterCode);
      }
      setOutput("");
      setShowHint(false);
      setShowSolution(false);
      setValidationResult(null);
    }
  }, [currentExercise, practiceMode]);

  // Run Python code
  const handleRunCode = useCallback(async () => {
    if (!isPyodideReady() || !currentExercise) return;

    setIsRunning(true);
    setOutput("");
    setErrorOutput("");
    setValidationResult(null);
    setPanelCollapsed(false); // Show panel when running

    try {
      const result = await runPython(userCode, 5000);

      if (result.success) {
        setOutput(result.output);
        setErrorOutput("");
        setActivePanel('output');

        // Validate output
        const isCorrect = validateOutput(
          result.output,
          currentExercise.expectedOutput
        );

        // Track completion if correct
        if (isCorrect) {
          recordCompletion(
            'python',
            selectedTopic,
            selectedDifficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
            currentExerciseIndex,
            1 // attempts (simplificato per ora)
          );
        }

        setValidationResult({
          isCorrect,
          message: isCorrect ? "Corretto! 🎉" : "Output non corretto",
          userOutput: result.output,
          expectedOutput: currentExercise.expectedOutput,
          hints: isCorrect ? undefined : currentExercise.hints,
        });
      } else {
        setOutput("");
        setErrorOutput(result.error || "Errore sconosciuto");
        setActivePanel('errors');
        setValidationResult({
          isCorrect: false,
          message: "Errore nel codice",
          userOutput: result.error || "",
          expectedOutput: currentExercise.expectedOutput,
        });
      }
    } catch (error: any) {
      setOutput("");
      setErrorOutput(error.message);
      setActivePanel('errors');
      setValidationResult({
        isCorrect: false,
        message: "Errore durante l'esecuzione",
        userOutput: error.message,
        expectedOutput: currentExercise.expectedOutput,
      });
    } finally {
      setIsRunning(false);
    }
  }, [userCode, currentExercise]);

  // Update current line on cursor move
  const updateCurrentLine = useCallback(() => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textBefore = userCode.substring(0, cursorPos);
      const lineNum = textBefore.split("\n").length - 1;
      setCurrentLineNumber(lineNum);
    }
  }, [userCode]);

  // Calculate autocomplete dropdown position
  const calculateDropdownPosition = useCallback(() => {
    if (!textareaRef.current) return { top: 0, left: 0 };
    const lineHeight = 21;
    const lines = userCode.substring(0, textareaRef.current.selectionStart).split('\n');
    const currentLineNum = lines.length - 1;
    const currentCol = lines[currentLineNum]?.length || 0;
    return {
      top: (currentLineNum + 1) * lineHeight + 16 - (textareaRef.current.scrollTop || 0),
      left: Math.min(200, currentCol * 8 + 60),
    };
  }, [userCode]);

  // Update autocomplete based on current word
  const updateAutocomplete = useCallback((query: string, cursorPosition: number) => {
    const textBefore = query.slice(0, cursorPosition);
    const words = textBefore.split(/[\s\n()\[\]{}:,]+/);
    const currentWord = words[words.length - 1]?.toLowerCase() || '';
    
    if (currentWord.length < 2) {
      setShowAutocomplete(false);
      return;
    }
    
    const items: AutocompleteItem[] = [];
    
    // Match keywords
    PYTHON_KEYWORDS.filter(kw => kw.toLowerCase().startsWith(currentWord))
      .forEach(kw => items.push({ label: kw, type: 'keyword' }));
    
    // Match builtins
    PYTHON_BUILTINS.filter(fn => fn.toLowerCase().startsWith(currentWord))
      .forEach(fn => items.push({ label: fn + '()', type: 'function' }));
    
    if (items.length > 0) {
      setAutocompleteItems(items.slice(0, 8));
      setAutocompletePosition(calculateDropdownPosition());
      setShowAutocomplete(true);
      setSelectedAutocompleteIndex(0);
    } else {
      setShowAutocomplete(false);
    }
  }, [calculateDropdownPosition]);

  // Handle autocomplete selection
  const handleAutocompleteSelect = useCallback((item: AutocompleteItem) => {
    if (!textareaRef.current) return;
    
    const cursorPos = textareaRef.current.selectionStart;
    const textBefore = userCode.substring(0, cursorPos);
    const words = textBefore.split(/[\s\n()\[\]{}:,]+/);
    const currentWord = words[words.length - 1] || '';
    const wordStart = cursorPos - currentWord.length;
    
    const newValue = userCode.substring(0, wordStart) + item.label + userCode.substring(cursorPos);
    setUserCode(newValue);
    
    const newCursorPos = wordStart + item.label.length;
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
    
    setShowAutocomplete(false);
  }, [userCode]);

  // Sync scroll between textarea and overlays
  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);


  // Handle keyboard shortcuts with Tab, auto-indent, snippets, autocomplete
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Execute on Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
        return;
      }

      // Toggle comment on Cmd+Shift+7 (Italian keyboard /)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '7' || e.key === '/' || e.code === 'Digit7')) {
        e.preventDefault();
        const textarea = e.currentTarget as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const lines = userCode.split('\n');
        
        // Find which lines are selected
        let charCount = 0;
        let startLine = 0;
        let endLine = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const lineEnd = charCount + lines[i].length;
          if (charCount <= start && start <= lineEnd + 1) startLine = i;
          if (charCount <= end && end <= lineEnd + 1) endLine = i;
          charCount = lineEnd + 1;
        }
        
        // Toggle # comment on each line
        const newLines = [...lines];
        const allCommented = lines.slice(startLine, endLine + 1).every(line => line.trimStart().startsWith('#'));
        
        for (let i = startLine; i <= endLine; i++) {
          if (allCommented) {
            // Remove comment
            newLines[i] = newLines[i].replace(/^(\s*)#\s?/, '$1');
          } else {
            // Add comment
            newLines[i] = '# ' + newLines[i];
          }
        }
        
        setUserCode(newLines.join('\n'));
        return;
      }

      // Autocomplete navigation
      if (showAutocomplete && autocompleteItems.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedAutocompleteIndex(prev => 
            prev < autocompleteItems.length - 1 ? prev + 1 : 0
          );
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedAutocompleteIndex(prev => 
            prev > 0 ? prev - 1 : autocompleteItems.length - 1
          );
          return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          handleAutocompleteSelect(autocompleteItems[selectedAutocompleteIndex]);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowAutocomplete(false);
          return;
        }
      }

      // Tab key: check for snippets first, else insert 4 spaces
      if (e.key === "Tab" && !showAutocomplete) {
        const textarea = e.currentTarget as HTMLTextAreaElement;
        const cursorPos = textarea.selectionStart;
        const textBefore = userCode.substring(0, cursorPos);
        const words = textBefore.split(/[\s\n]+/);
        const lastWord = words[words.length - 1]?.toLowerCase() || '';
        
        // Check for snippet
        const snippet = PYTHON_SNIPPETS[lastWord];
        if (snippet) {
          e.preventDefault();
          const wordStart = cursorPos - lastWord.length;
          const newValue = userCode.substring(0, wordStart) + snippet.text + userCode.substring(cursorPos);
          setUserCode(newValue);
          
          setTimeout(() => {
            if (textareaRef.current) {
              const newPos = wordStart + snippet.cursorOffset;
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
            }
          }, 0);
          return;
        }
        
        // Default: insert 4 spaces
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = userCode.substring(0, start) + "    " + userCode.substring(end);
        setUserCode(newValue);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
          }
        }, 0);
        return;
      }

      // Auto-indent after Enter (skip if autocomplete is open)
      if (e.key === "Enter" && !showAutocomplete) {
        const textarea = e.currentTarget as HTMLTextAreaElement;
        const cursorPos = textarea.selectionStart;
        const textBefore = userCode.substring(0, cursorPos);
        const currentLine = textBefore.split("\n").pop() || "";

        const indentMatch = currentLine.match(/^(\s*)/);
        const currentIndent = indentMatch ? indentMatch[1] : "";
        const shouldIndent = currentLine.trimEnd().endsWith(":");
        const extraIndent = shouldIndent ? "    " : "";

        e.preventDefault();
        const newValue = userCode.substring(0, cursorPos) + "\n" + currentIndent + extraIndent + userCode.substring(cursorPos);
        setUserCode(newValue);

        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = cursorPos + 1 + currentIndent.length + extraIndent.length;
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
            updateCurrentLine();
          }
        }, 0);
        return;
      }
    },
    [handleRunCode, userCode, updateCurrentLine, showAutocomplete, autocompleteItems, selectedAutocompleteIndex, handleAutocompleteSelect]
  );


  // Navigation
  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    if (currentExercise) {
      if (practiceMode === "solve") {
        setUserCode(currentExercise.starterCode);
      } else {
        setUserCode(currentExercise.brokenCode || currentExercise.starterCode);
      }
      setOutput("");
      setValidationResult(null);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  // Simple syntax highlighting for Python using token placeholders
  const highlightPython = (code: string): string => {
    // First escape HTML
    let processed = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const tokens: Array<{ placeholder: string; html: string }> = [];
    let tokenCounter = 0;

    // Helper to create unique placeholder
    const createToken = (html: string): string => {
      const placeholder = `__TOKEN_${tokenCounter++}__`;
      tokens.push({ placeholder, html });
      return placeholder;
    };

    // Process line by line for comments
    const lines = processed.split("\n");
    processed = lines
      .map((line) => {
        // Comments first (protect entire rest of line)
        if (line.includes("#")) {
          const hashIndex = line.indexOf("#");
          const beforeComment = line.substring(0, hashIndex);
          const comment = line.substring(hashIndex);
          return (
            beforeComment +
            createToken(`<span class="text-slate-500">${comment}</span>`)
          );
        }
        return line;
      })
      .join("\n");

    // Strings (protect from other replacements)
    processed = processed.replace(/('[^']*'|"[^"]*")/g, (match) => {
      if (match.includes("__TOKEN_")) return match;
      return createToken(`<span class="text-emerald-400">${match}</span>`);
    });

    // Keywords
    const keywords = [
      "def",
      "class",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "return",
      "import",
      "from",
      "as",
      "in",
      "not",
      "and",
      "or",
      "True",
      "False",
      "None",
      "break",
      "continue",
      "pass",
      "try",
      "except",
      "finally",
      "with",
      "lambda",
      "yield",
    ];
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b`, "g");
      processed = processed.replace(regex, (match) => {
        if (match.includes("__TOKEN_")) return match;
        return createToken(
          `<span class="text-purple-400 font-semibold">${match}</span>`
        );
      });
    });

    // Built-in functions (only when followed by parenthesis)
    const builtins = [
      "print",
      "input",
      "len",
      "range",
      "int",
      "float",
      "str",
      "list",
      "dict",
      "set",
      "tuple",
      "type",
      "abs",
      "min",
      "max",
      "sum",
      "sorted",
      "enumerate",
      "zip",
      "map",
      "filter",
      "any",
      "all",
      "pow",
      "round",
      "bool",
    ];
    builtins.forEach((fn) => {
      const regex = new RegExp(`\\b(${fn})(?=\\()`, "g");
      processed = processed.replace(regex, (match) => {
        if (match.includes("__TOKEN_")) return match;
        return createToken(`<span class="text-amber-400">${match}</span>`);
      });
    });

    // Numbers
    processed = processed.replace(/\b(\d+\.?\d*)\b/g, (match) => {
      if (match.includes("__TOKEN_")) return match;
      return createToken(`<span class="text-cyan-400">${match}</span>`);
    });

    // Replace all tokens with actual HTML
    tokens.forEach(({ placeholder, html }) => {
      processed = processed.replace(placeholder, html);
    });

    return processed;
  };

  // Determine available topics based on search
  const filteredTopics = React.useMemo(() => {
    return PYTHON_TOPICS.filter(
      (t) =>
        t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Update sliding background for sidebar
  useLayoutEffect(() => {
    const activeElement = itemsRef.current[selectedTopic];
    if (activeElement) {
      setActiveTopicStyle({
        top: activeElement.offsetTop,
        height: activeElement.offsetHeight,
        opacity: 1,
      });
    } else {
      setActiveTopicStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [selectedTopic, filteredTopics]);

  return (
    <div className={`flex h-screen bg-transparent text-slate-200 font-sans overflow-hidden selection:bg-${themeColor}-500 selection:text-white`}>

      <div className="flex flex-1 gap-5">

        {/* LEFT SIDEBAR - GLASS STYLE */}
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
              <span className="text-white">PYTHON</span>
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
              const isActive = selectedTopic === topic.id;
              
              return (
                <button
                  key={topic.id}
                  ref={(el) => { itemsRef.current[topic.id] = el; }}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`w-full relative group rounded-xl overflow-hidden transition-all duration-300 hover:pl-2 z-10 outline-none focus:outline-none ${
                    isActive ? "shadow-lg shadow-black/40" : "hover:bg-slate-800/50"
                  }`}
                >
                  <div className={`relative px-4 py-3 flex items-start gap-3`}>
                    <div className={`shrink-0 mt-0.5 transition-colors duration-300 ${
                      isActive
                        ? `${textActive} drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]`
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}>
                      {TOPIC_ICONS[topic.id] || <Hash size={18} />}
                    </div>
                    
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
                      <span className="text-xs text-slate-400 mt-0.5 line-clamp-1 block group-hover:text-slate-300 transition-colors">
                        {topic.description}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>



        {/* MAIN AREA - HEADER WITH SLIDING PILLS */}
        <main className={`flex-1 flex flex-col min-w-0 h-full pr-6 pl-1`}>
          <header className="h-16 flex items-center justify-between mt-4 mb-1 z-10 shrink-0">
             <div className="flex items-center gap-2 w-full">
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
                onClick={() => setPracticeMode("solve")}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase min-w-[100px] ${
                  isGymMode
                    ? "text-white text-shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Dumbbell size={14} strokeWidth={2.5} /> SOLVE
              </button>
              <button
                onClick={() => setPracticeMode("debug")}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase min-w-[100px] ${
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

            {/* SLIDING PILL FOR DIFFICULTY */}
            <div className="relative flex bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20">
              <div
                className={`absolute top-1.5 bottom-1.5 rounded-lg shadow-lg transition-all duration-300 ease-out ${
                  selectedDifficulty === Difficulty.Easy
                    ? "left-1.5 w-[calc(33.333%-0.5rem)] bg-gradient-to-b from-green-500/30 to-green-600/5 border border-white/15 shadow-[0_0_15px_rgba(34,197,94,0.2)_inset] shadow-green-600/20"
                    : selectedDifficulty === Difficulty.Medium
                    ? "left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.5rem)] bg-gradient-to-b from-orange-500/30 to-orange-600/5 border border-white/15 shadow-[0_0_15px_rgba(249,115,22,0.2)_inset] shadow-orange-600/20"
                    : "left-[66.666%] w-[calc(33.333%-0.375rem)] bg-gradient-to-b from-red-500/30 to-red-600/5 border border-white/15 shadow-[0_0_15px_rgba(239,68,68,0.2)_inset] shadow-red-600/20"
                }`}
              ></div>
              {Object.values(Difficulty).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`relative z-10 px-4 py-2 text-xs font-bold rounded-lg transition-colors min-w-[70px] ${
                    selectedDifficulty === d
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
             </div>
             
             {/* Pyodide Status */}
             <div className="flex items-center gap-2 text-sm bg-[#121212]/70 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/5 shadow-lg shadow-black/20 ml-2">
                {pyodideLoading ? (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Loader2 className="animate-spin" size={14} />
                    <span className="text-xs font-medium">Caricamento...</span>
                  </div>
                ) : pyodideError ? (
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle size={14} />
                    <span className="text-xs font-medium">Errore</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium">Pronto</span>
                  </div>
                )}
             </div>

             {/* Analytics Button */}
             {onNavigate && (
               <button
                 onClick={() => onNavigate(Page.Analytics)}
                 className="flex items-center gap-2 text-sm bg-purple-500/10 hover:bg-purple-500/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all ml-2"
               >
                 <TrendingUp size={14} className="text-purple-400" />
                 <span className="text-xs font-medium text-purple-300">Analytics</span>
               </button>
             )}

             {/* User Badge */}
             <div className="ml-auto">
               <UserBadge onNavigate={onNavigate} />
             </div>
          </header>

          <div className="flex-1 flex flex-col overflow-hidden relative">
          {currentExercise ? (
            <>
              {/* Exercise Header */}
              <div className="p-4 border-b border-white/10 bg-black/10">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {practiceMode === "debug" && (
                      <Bug className="text-red-400" size={20} />
                    )}
                    {currentExercise.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevExercise}
                      disabled={currentExerciseIndex === 0}
                      className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-slate-400 min-w-[60px] text-center">
                      {currentExerciseIndex + 1} / {exercises.length}
                    </span>
                    <button
                      onClick={handleNextExercise}
                      disabled={currentExerciseIndex === exercises.length - 1}
                      className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">
                  {currentExercise.description}
                </p>
                {practiceMode === "debug" && currentExercise.debugHint && (
                  <p className="text-red-400/80 text-sm mt-2 flex items-center gap-2">
                    <Bug size={14} />
                    <span>Trova e correggi l'errore nel codice</span>
                  </p>
                )}
              </div>

              {/* Editor and Output - Vertical Layout */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Code Editor */}
                <div className="flex-1 flex flex-col border-b border-white/10 min-h-0 bg-black/40">
                  <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/5">
                    <span className="text-sm font-medium text-slate-400">
                      main.py
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReset}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                        title="Reset"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className={`p-2 rounded-lg transition-all ${
                          showHint
                            ? "bg-amber-500/20 text-amber-400"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                        title="Suggerimento"
                      >
                        <Lightbulb size={16} />
                      </button>
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className={`p-2 rounded-lg transition-all ${
                          showSolution
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                        title="Soluzione"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="w-px h-4 bg-white/10 mx-1" />
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning || pyodideLoading}
                        className={`p-2 rounded-lg transition-all ${
                          isRunning 
                            ? "bg-amber-500/20 text-amber-400"
                            : "text-slate-400 hover:bg-amber-500/20 hover:text-amber-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Esegui (⌘+Enter)"
                      >
                        {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Hint/Solution Panel */}
                  {(showHint || showSolution) && (
                    <div
                      className={`px-4 py-3 border-b border-white/10 ${
                        showSolution ? "bg-emerald-950/30" : "bg-amber-950/30"
                      }`}
                    >
                      {showHint && !showSolution && currentExercise.hints && (
                        <div className="text-amber-300 text-sm">
                          <span className="font-semibold">
                            💡 Suggerimento:{" "}
                          </span>
                          {currentExercise.hints[0]}
                        </div>
                      )}
                      {showSolution && (
                        <div className="text-emerald-300 text-sm">
                          <span className="font-semibold">✅ Soluzione: </span>
                          <pre className="mt-2 p-2 bg-black/30 rounded text-xs overflow-x-auto">
                            {currentExercise.solutionCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code Editor with Line Numbers */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Line Numbers */}
                    <div 
                      ref={lineNumbersRef}
                      className="w-12 bg-black/30 border-r border-white/10 overflow-hidden flex-shrink-0"
                    >
                      <div className="py-4 px-2">
                        {userCode.split('\n').map((_, idx) => (
                          <div 
                            key={idx}
                            className={`text-xs leading-[21px] font-mono h-[21px] text-right pr-2 transition-colors ${
                              idx === currentLineNumber
                                ? 'text-amber-400 bg-amber-500/10 rounded-l'
                                : 'text-slate-600'
                            }`}
                          >
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative overflow-hidden">
                      {/* Highlighted Background Layer with Indent Rainbow */}
                      <div 
                        ref={highlightRef}
                        className="absolute inset-0 font-mono text-sm overflow-auto pointer-events-none"
                      >
                        <div className="p-4">
                          {userCode.split('\n').map((line, idx) => {
                            // Calculate indent level for rainbow
                            const indentMatch = line.match(/^(\s*)/);
                            const spaces = indentMatch ? indentMatch[1].length : 0;
                            const indentLevel = Math.floor(spaces / 4);
                            const indentColor = indentLevel > 0 ? INDENT_COLORS[(indentLevel - 1) % INDENT_COLORS.length] : 'transparent';
                            
                            return (
                              <div 
                                key={idx}
                                className={`h-[21px] leading-[21px] whitespace-pre ${
                                  idx === currentLineNumber
                                    ? 'bg-amber-500/5 -mx-4 px-4'
                                    : ''
                                }`}
                                style={{
                                  borderLeft: indentLevel > 0 ? `3px solid ${indentColor.replace('0.07', '0.4')}` : 'none',
                                  paddingLeft: indentLevel > 0 ? '8px' : undefined,
                                  marginLeft: indentLevel > 0 ? '-3px' : undefined,
                                }}
                                dangerouslySetInnerHTML={{ 
                                  __html: highlightPython(line) || '&nbsp;' 
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Textarea (invisible but functional) */}
                      <textarea
                        ref={textareaRef}
                        value={userCode}
                        onChange={(e) => {
                          setUserCode(e.target.value);
                          setTimeout(updateCurrentLine, 0);
                          // Trigger autocomplete
                          setTimeout(() => {
                            if (textareaRef.current) {
                              updateAutocomplete(e.target.value, textareaRef.current.selectionStart);
                            }
                          }, 0);
                        }}
                        onKeyDown={handleKeyDown}
                        onKeyUp={updateCurrentLine}
                        onClick={() => {
                          updateCurrentLine();
                          setShowAutocomplete(false);
                        }}
                        onScroll={handleScroll}
                        className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-[21px] bg-transparent text-transparent caret-amber-400 resize-none focus:outline-none z-10"
                        spellCheck={false}
                        placeholder="Scrivi il tuo codice Python qui..."
                      />

                      {/* Autocomplete Dropdown */}
                      <AutocompleteDropdown
                        items={autocompleteItems}
                        visible={showAutocomplete}
                        position={autocompletePosition}
                        onSelect={handleAutocompleteSelect}
                        onClose={() => setShowAutocomplete(false)}
                        selectedIndex={selectedAutocompleteIndex}
                        onSelectedIndexChange={setSelectedAutocompleteIndex}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Panel: Output/Errors with tabs */}
                {!panelCollapsed && (
                  <div 
                    style={{ height: panelHeight }}
                    className="border-t border-white/10 flex flex-col bg-[#1a1a1a]/80 backdrop-blur-md"
                  >
                    {/* Resize Handle */}
                    <div 
                      className="h-1 bg-transparent hover:bg-amber-500/30 cursor-ns-resize flex-shrink-0"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startY = e.clientY;
                        const startHeight = panelHeight;
                        
                        const onMouseMove = (e: MouseEvent) => {
                          const deltaY = startY - e.clientY;
                          setPanelHeight(Math.max(100, Math.min(500, startHeight + deltaY)));
                        };
                        
                        const onMouseUp = () => {
                          document.removeEventListener('mousemove', onMouseMove);
                          document.removeEventListener('mouseup', onMouseUp);
                        };
                        
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                      }}
                    />

                    {/* Panel Header with Tabs */}
                    <div className="flex items-center justify-between px-2 py-1 bg-black/40 border-b border-white/10">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActivePanel('output')}
                          className={`px-3 py-1 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
                            activePanel === 'output'
                              ? 'bg-white/10 text-white'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Terminal size={12} />
                          Output
                        </button>
                        <button
                          onClick={() => setActivePanel('errors')}
                          className={`px-3 py-1 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
                            activePanel === 'errors'
                              ? 'bg-white/10 text-white'
                              : 'text-slate-500 hover:text-slate-300'
                          } ${errorOutput ? 'text-red-400' : ''}`}
                        >
                          <AlertTriangle size={12} />
                          Errori
                          {errorOutput && <span className="w-2 h-2 rounded-full bg-red-500" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Expected Output Mini Badge */}
                        {currentExercise && (
                          <span className="text-[10px] text-slate-500 px-2 py-0.5 bg-black/30 rounded mr-2">
                            Atteso: {currentExercise.expectedOutput.substring(0, 30)}...
                          </span>
                        )}
                        <button
                          onClick={() => setPanelCollapsed(true)}
                          className="p-1 text-slate-500 hover:text-white transition-all"
                          title="Comprimi"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-auto">
                      {/* Validation Result Banner */}
                      {validationResult && (
                        <div
                          className={`px-4 py-2 border-b border-white/10 ${
                            validationResult.isCorrect
                              ? "bg-emerald-950/50"
                              : "bg-red-950/50"
                          }`}
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-bold ${
                              validationResult.isCorrect
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {validationResult.isCorrect ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}
                            {validationResult.message}
                          </div>
                        </div>
                      )}

                      {/* Output Tab Content */}
                      {activePanel === 'output' && (
                        <div className="p-3">
                          <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
                            {output || (
                              <span className="text-slate-500 italic">
                                Premi ▶ per vedere l'output...
                              </span>
                            )}
                          </pre>
                        </div>
                      )}

                      {/* Errors Tab Content */}
                      {activePanel === 'errors' && (
                        <div className="p-3">
                          <pre className="font-mono text-sm text-red-400 whitespace-pre-wrap">
                            {errorOutput || (
                              <span className="text-slate-500 italic">
                                Nessun errore
                              </span>
                            )}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Collapsed Panel Bar */}
                {panelCollapsed && (
                  <div 
                    className="h-8 border-t border-white/10 bg-black/30 flex items-center px-4 cursor-pointer hover:bg-black/40"
                    onClick={() => setPanelCollapsed(false)}
                  >
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Terminal size={12} />
                      <span>Panel</span>
                      <ChevronUp size={12} />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Code2 size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nessun esercizio disponibile per questa selezione</p>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PythonGym;
