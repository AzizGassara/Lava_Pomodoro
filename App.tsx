import React, { useState, useEffect } from 'react';
import LavaBackground from './components/LavaBackground';
import Timer from './components/Timer';
import TodoList from './components/TodoList';
import SettingsModal from './components/SettingsModal';
import BreakSuggestionModal from './components/BreakSuggestionModal';
import { THEMES } from './constants';
import { TimerMode, TimerSettings, Task, BreakSuggestion } from './types';
import { Settings, Maximize2, Quote, Sparkles } from 'lucide-react';
import { suggestBreakActivity, getMotivationalQuote } from './services/geminiService';
import { playSound } from './services/soundService';

const App: React.FC = () => {
  // --- State ---
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : THEMES[0];
  });
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStartBreaks: false,
        autoStartPomodoros: false
      };
  });

  // AI Features State
  const [quote, setQuote] = useState("Flow like lava.");
  const [breakSuggestion, setBreakSuggestion] = useState<BreakSuggestion | null>(null);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isLoadingBreak, setIsLoadingBreak] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

  // --- Effects ---

  // Persist API Key
  useEffect(() => {
    localStorage.setItem('gemini_api_key', geminiApiKey);
  }, [geminiApiKey]);

  // Persist Theme
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  // Persist Timer Settings
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(timerSettings));
  }, [timerSettings]);

  // Persist Tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Fetch Quote on Mount or Theme Change
  useEffect(() => {
    const fetchQuote = async () => {
      const q = await getMotivationalQuote(theme.name, geminiApiKey);
      setQuote(q);
    };
    fetchQuote();
  }, [theme, geminiApiKey]);

  // Handle Timer Complete
  const handleTimerComplete = async () => {
    // 1. Play sound
    playSound('finish');

    // 2. Switch Mode logic
    if (timerMode === TimerMode.FOCUS) {
      // Trigger AI Break Suggestion
      setIsBreakModalOpen(true);
      setIsLoadingBreak(true);
      const activeTaskTitle = tasks.find(t => t.id === activeTaskId)?.title || "General Work";
      const suggestion = await suggestBreakActivity(activeTaskTitle, geminiApiKey);
      setBreakSuggestion(suggestion);
      setIsLoadingBreak(false);

      // Auto-switch to break (logic simplified)
      setTimerMode(TimerMode.SHORT_BREAK);
    } else {
      // Break over, back to work
      setTimerMode(TimerMode.FOCUS);
    }
  };

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans">

      {/* Background Layer */}
      <LavaBackground theme={theme} />

      {/* Main Content Layer */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">

        {/* Left Column: Timer & Vibe */}
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors cursor-default">
            <Sparkles size={16} />
            <span className="uppercase tracking-[0.3em] text-xs font-bold">{theme.name} Mode</span>
          </div>

          <Timer
            settings={timerSettings}
            mode={timerMode}
            onModeChange={setTimerMode}
            onTimerComplete={handleTimerComplete}
          />

          <div className="max-w-md text-center">
            <p className="text-2xl font-light text-white/80 italic leading-relaxed">"{quote}"</p>
          </div>
        </div>

        {/* Right Column: Todo List */}
        <div className="flex flex-col items-center lg:items-start w-full">
          <div className="w-full flex justify-between items-center mb-4 px-2">
            <div className="text-white/60 text-sm">
              {activeTaskId ? (
                <span className="flex items-center gap-2 text-purple-300 animate-pulse">
                  Currently focusing on: <span className="font-bold text-white">{tasks.find(t => t.id === activeTaskId)?.title}</span>
                </span>
              ) : "Select a task to focus"}
            </div>
          </div>
          <TodoList
            tasks={tasks}
            setTasks={setTasks}
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
          />
        </div>
      </div>

      {/* UI Controls (Top Right) */}
      <div className="absolute top-6 right-6 z-20 flex gap-4">
        <button
          onClick={toggleFullScreen}
          className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all border border-white/5"
          title="Fullscreen"
        >
          <Maximize2 size={20} />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all border border-white/5"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        timerSettings={timerSettings}
        setTimerSettings={setTimerSettings}
        currentTheme={theme}
        setTheme={setTheme}
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
      />

      <BreakSuggestionModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
        suggestion={breakSuggestion}
        loading={isLoadingBreak}
      />
    </div>
  );
};

export default App;