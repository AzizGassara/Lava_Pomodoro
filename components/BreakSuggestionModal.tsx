import React from 'react';
import { BreakSuggestion } from '../types';
import { Coffee, Wind, Eye, Activity, Smile, Music, X } from 'lucide-react';

interface BreakSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: BreakSuggestion | null;
  loading: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee size={48} />,
  Wind: <Wind size={48} />,
  Eye: <Eye size={48} />,
  Activity: <Activity size={48} />,
  Smile: <Smile size={48} />,
  Music: <Music size={48} />
};

const BreakSuggestionModal: React.FC<BreakSuggestionModalProps> = ({ isOpen, onClose, suggestion, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
       <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
            <X size={20} />
        </button>

        {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-white/60 animate-pulse">Consulting the lava...</p>
            </div>
        ) : suggestion ? (
            <div className="animate-fade-in-up">
                <div className="mx-auto mb-6 text-white/80 w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    {iconMap[suggestion.icon] || <Smile size={48} />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Time to Recharge</h3>
                <p className="text-white/80 text-lg mb-4">{suggestion.activity}</p>
                <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-mono text-white">
                    {suggestion.duration}
                </div>
                
                <button 
                    onClick={onClose}
                    className="mt-8 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Start Break
                </button>
            </div>
        ) : (
             <div className="py-8 text-white/60">Could not generate suggestion.</div>
        )}
       </div>
    </div>
  );
};

export default BreakSuggestionModal;
