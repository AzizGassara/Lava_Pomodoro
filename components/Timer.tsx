import React, { useEffect, useState, useRef } from 'react';
import { TimerMode, TimerSettings } from '../types';
import { playSound } from '../services/soundService';
import { Play, Pause, RefreshCw, SkipForward } from 'lucide-react';

interface TimerProps {
  settings: TimerSettings;
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  onTimerComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ settings, mode, onModeChange, onTimerComplete }) => {
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(settings.focusDuration * 60);
  
  // Ref to store the absolute end time. 
  // This prevents timer drift when the tab is inactive/throttled.
  const endTimeRef = useRef<number | null>(null);

  // Sync timer with settings/mode
  useEffect(() => {
    let duration = settings.focusDuration * 60;
    if (mode === TimerMode.SHORT_BREAK) duration = settings.shortBreakDuration * 60;
    if (mode === TimerMode.LONG_BREAK) duration = settings.longBreakDuration * 60;
    
    setTimeLeft(duration);
    setInitialTime(duration);
    
    // Reset timer state
    setIsActive(false);
    endTimeRef.current = null;

    // Auto-start logic
    const shouldAutoStartFocus = mode === TimerMode.FOCUS && settings.autoStartPomodoros;
    const shouldAutoStartBreak = (mode === TimerMode.SHORT_BREAK || mode === TimerMode.LONG_BREAK) && settings.autoStartBreaks;

    if (shouldAutoStartFocus || shouldAutoStartBreak) {
      setIsActive(true);
      // Set the end time immediately based on the new duration
      endTimeRef.current = Date.now() + duration * 1000;
    }

  }, [mode, settings]);

  // Timer Tick Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive) {
      // Safety check: if active but no end time (e.g. hot reload or unexpected state), set it relative to current timeLeft
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        if (!endTimeRef.current) return;

        const now = Date.now();
        const diff = endTimeRef.current - now;
        const remaining = Math.ceil(diff / 1000);

        if (remaining <= 0) {
          // Timer finished
          setTimeLeft(0);
          setIsActive(false);
          endTimeRef.current = null;
          onTimerComplete();
        } else {
          // Update display
          setTimeLeft(remaining);
        }
      }, 100); // Check every 100ms for responsiveness, though state updates will naturally batch
    } else {
      // If paused, ensure ref is cleared so it resets on resume
      endTimeRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]); // Dependency on isActive only. timeLeft is read from the calculated diff.

  const toggleTimer = () => {
    if (!isActive) {
      playSound('start');
      // Resuming/Starting: Calculate new end time based on whatever is currently left
      endTimeRef.current = Date.now() + timeLeft * 1000;
    } else {
      playSound('pause');
      // Pausing: endTimeRef is cleared by the effect cleanup/else branch logic implicitly
      // essentially, we stop the interval. 'timeLeft' state holds the current paused value.
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    playSound('reset');
    setIsActive(false);
    endTimeRef.current = null;
    setTimeLeft(initialTime);
  };

  const skipTimer = () => {
    playSound('reset');
    setIsActive(false);
    endTimeRef.current = null;
    onTimerComplete();
  };

  // Circular Progress Calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  // Prevent division by zero
  const progress = initialTime > 0 ? timeLeft / initialTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    // Prevent negative numbers display
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 relative">
       {/* Glass Card Background for Timer */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full shadow-2xl border border-white/10" style={{ transform: 'scale(1.1)' }} />

      <div className="relative z-10">
        <svg width="300" height="300" className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="white"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-200 ease-linear"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-6xl font-bold tracking-widest font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm uppercase tracking-widest opacity-70 mt-2">
            {mode === TimerMode.FOCUS ? 'Focus' : 'Break'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6 mt-8 z-10">
        <button
          onClick={toggleTimer}
          className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 active:scale-95 border border-white/10"
        >
          {isActive ? <Pause size={32} /> : <Play size={32} fill="white" />}
        </button>
        
        <button
          onClick={resetTimer}
          className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 active:scale-95 border border-white/10"
        >
          <RefreshCw size={24} />
        </button>

        <button
          onClick={skipTimer}
          className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 active:scale-95 border border-white/10"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;