import { LavaLampTheme } from "./types";

export const THEMES: LavaLampTheme[] = [
  {
    id: 'magma',
    name: 'Magma',
    colors: ['#FF4500', '#FF8C00', '#DC143C', '#8B0000'],
    speed: 1,
    intensity: 1,
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    colors: ['#00008B', '#1E90FF', '#00CED1', '#4682B4'],
    speed: 0.8,
    intensity: 0.8,
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    colors: ['#4B0082', '#9400D3', '#FF00FF', '#8A2BE2'],
    speed: 0.6,
    intensity: 0.9,
  },
  {
    id: 'toxic',
    name: 'Toxic Sludge',
    colors: ['#32CD32', '#00FF00', '#ADFF2F', '#006400'],
    speed: 1.2,
    intensity: 1,
  },
    {
    id: 'midnight',
    name: 'Midnight Jazz',
    colors: ['#2C3E50', '#FD746C', '#2980B9', '#FFFFFF'],
    speed: 0.5,
    intensity: 0.6,
  }
];
