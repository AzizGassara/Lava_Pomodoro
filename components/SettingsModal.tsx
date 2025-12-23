import React from 'react';
import { LavaLampTheme, TimerSettings } from '../types';
import { THEMES } from '../constants';
import { X, Clock, Palette, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerSettings: TimerSettings;
  setTimerSettings: (s: TimerSettings) => void;
  currentTheme: LavaLampTheme;
  setTheme: (t: LavaLampTheme) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, timerSettings, setTimerSettings, currentTheme, setTheme, geminiApiKey, setGeminiApiKey
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            Settings
          </h2>

          {/* Section: Themes */}
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
              <Palette size={16} /> Theme
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${currentTheme.id === theme.id
                      ? 'bg-white/10 border-white/60'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                >
                  <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }} />
                  <span className="text-xs text-white/80">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Timer */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
              <Clock size={16} /> Timer Durations (min)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <label className="text-white/80">Focus</label>
                <input
                  type="number"
                  value={timerSettings.focusDuration}
                  onChange={(e) => setTimerSettings({ ...timerSettings, focusDuration: Number(e.target.value) })}
                  className="w-20 bg-black/50 border border-white/10 rounded px-2 py-1 text-right text-white focus:outline-none focus:border-white/50"
                />
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <label className="text-white/80">Short Break</label>
                <input
                  type="number"
                  value={timerSettings.shortBreakDuration}
                  onChange={(e) => setTimerSettings({ ...timerSettings, shortBreakDuration: Number(e.target.value) })}
                  className="w-20 bg-black/50 border border-white/10 rounded px-2 py-1 text-right text-white focus:outline-none focus:border-white/50"
                />
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <label className="text-white/80">Long Break</label>
                <input
                  type="number"
                  value={timerSettings.longBreakDuration}
                  onChange={(e) => setTimerSettings({ ...timerSettings, longBreakDuration: Number(e.target.value) })}
                  className="w-20 bg-black/50 border border-white/10 rounded px-2 py-1 text-right text-white focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white">
                <input
                  type="checkbox"
                  checked={timerSettings.autoStartBreaks}
                  onChange={e => setTimerSettings({ ...timerSettings, autoStartBreaks: e.target.checked })}
                  className="accent-purple-500 w-4 h-4"
                />
                Auto-start Breaks
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white">
                <input
                  type="checkbox"
                  checked={timerSettings.autoStartPomodoros}
                  onChange={e => setTimerSettings({ ...timerSettings, autoStartPomodoros: e.target.checked })}
                  className="accent-purple-500 w-4 h-4"
                />
                Auto-start Focus
              </label>
            </div>
          </div>

          {/* Section: AI Configuration */}
          <div className="mt-8">
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
              <Sparkles size={16} /> AI Configuration
            </h3>
            <div className="bg-white/5 p-4 rounded-lg">
              <label className="block text-white/80 text-sm mb-2">Gemini API Key</label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Paste your Gemini Key here..."
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/50 text-sm"
              />
              <p className="text-white/30 text-xs mt-2">
                Leave empty to use offline mode with basic templates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
