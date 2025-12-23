export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks?: Task[];
}

export enum TimerMode {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

export interface TimerSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface LavaLampTheme {
  id: string;
  name: string;
  colors: string[]; // CSS color strings
  speed: number; // multiplier
  intensity: number; // 0-1
}

export interface BreakSuggestion {
  activity: string;
  duration: string; // e.g. "5 mins"
  icon: string;
}
