import { GoogleGenAI, Type } from "@google/genai";
import { BreakSuggestion, Task } from "../types";

// --- Fallback Data ---

const FALLBACK_BREAKS: BreakSuggestion[] = [
  // Physical
  { activity: "Desk Yoga: Seated Twist", duration: "2 mins", icon: "Activity" },
  { activity: "Doorway Stretch", duration: "1 min", icon: "Activity" },
  { activity: "Neck Rolls & Shoulder Shrugs", duration: "2 mins", icon: "Activity" },
  { activity: "20 Jumping Jacks", duration: "1 min", icon: "Zap" },
  { activity: "Wrist & Hand Massage", duration: "3 mins", icon: "Activity" },

  // Mental / Calm
  { activity: "Box Breathing (4-4-4-4)", duration: "3 mins", icon: "Wind" },
  { activity: "Close Eyes & Visualise a Beach", duration: "2 mins", icon: "Eye" },
  { activity: "Write down 3 things you're grateful for", duration: "3 mins", icon: "PenTool" },
  { activity: "Listen to one favorite song", duration: "4 mins", icon: "Music" },

  // Refresh
  { activity: "Splash cold water on face", duration: "2 mins", icon: "Droplets" },
  { activity: "Drink a full glass of water", duration: "1 min", icon: "Coffee" }, // Coffee icon often used for drink
  { activity: "Look at something green (plant/outside)", duration: "2 mins", icon: "Eye" },
  { activity: "Tidy one small area of your desk", duration: "3 mins", icon: "CheckSquare" }
];

const FALLBACK_QUOTES: Record<string, string[]> = {
  "Magma": [
    "Flow like fire, steady and unstoppable.",
    "Heat tempers the strongest steel.",
    "Let your focus burn bright.",
    "Erupt with potential.",
    "Keep the inner fire alive."
  ],
  "Deep Ocean": [
    "Be as vast as the sea.",
    "Waves don't stop; neither should you.",
    "Depth over distance.",
    "Flow around obstacles like water.",
    "Calm surface, powerful current."
  ],
  "Cosmic Nebula": [
    "Aim for the stars.",
    "Infinite possibilities await.",
    "Shine in the void.",
    "Orbit your goals.",
    "Stardust and determination."
  ],
  "Toxic Sludge": [
    "Radioactive focus.",
    "Glow with energy.",
    "Mutate obstacles into opportunities.",
    "Hazardously productive.",
    "Green light: Go."
  ],
  "Midnight Jazz": [
    "Find your rhythm.",
    "Smooth execution.",
    "Improvise, adapt, overcome.",
    "Cool, calm, collected.",
    "Notes in the silence."
  ],
  "Default": [
    "One step at a time.",
    "Focus is the key.",
    "Create your own momentum.",
    "Silence the noise.",
    "You are capable."
  ]
};

const getFallbackQuote = (themeName: string): string => {
  // Try direct match first
  let quotes = FALLBACK_QUOTES[themeName];

  // If not found, try partial match logic or default
  if (!quotes) {
    const lower = themeName.toLowerCase();
    if (lower.includes("magma") || lower.includes("lava") || lower.includes("fire")) quotes = FALLBACK_QUOTES["Magma"];
    else if (lower.includes("ocean") || lower.includes("water")) quotes = FALLBACK_QUOTES["Deep Ocean"];
    else if (lower.includes("nebula") || lower.includes("space") || lower.includes("cosmic")) quotes = FALLBACK_QUOTES["Cosmic Nebula"];
    else if (lower.includes("toxic") || lower.includes("sludge") || lower.includes("green")) quotes = FALLBACK_QUOTES["Toxic Sludge"];
    else if (lower.includes("midnight") || lower.includes("jazz") || lower.includes("dark")) quotes = FALLBACK_QUOTES["Midnight Jazz"];
    else quotes = FALLBACK_QUOTES["Default"];
  }

  return quotes[Math.floor(Math.random() * quotes.length)];
};

// --- API Functions ---

export const generateSubtasks = async (taskTitle: string, apiKey?: string): Promise<string[]> => {
  if (!apiKey) {
    return ["Break it down", "Start small", "Keep going"];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.0-flash-lite';
    const response = await ai.models.generateContent({
      model,
      contents: `Break down the task "${taskTitle}" into 3-5 actionable subtasks suitable for a 25-minute Pomodoro session. Return only the subtask titles as a JSON array of strings. Keep them concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as string[];
    }
    return [];
  } catch (error) {
    console.error("Gemini breakdown error:", error);
    return ["Analyze requirements", "Draft outline", "Review progress"];
  }
};

export const suggestBreakActivity = async (previousTask: string, apiKey?: string): Promise<BreakSuggestion> => {
  if (!apiKey) {
    return FALLBACK_BREAKS[Math.floor(Math.random() * FALLBACK_BREAKS.length)];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.0-flash-lite';
    const response = await ai.models.generateContent({
      model,
      contents: `The user just finished a focus session working on: "${previousTask}". Suggest a quick, healthy, specific break activity (physical or mental) to recharge. 
      Examples: "Stretch your wrists", "Drink a glass of water", "Look out the window".
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activity: { type: Type.STRING },
            duration: { type: Type.STRING },
            icon: { type: Type.STRING, description: "A lucid-react icon name equivalent, e.g., 'Coffee', 'Wind', 'Activity', 'Eye'" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BreakSuggestion;
    }
    return FALLBACK_BREAKS[0];
  } catch (error) {
    console.error("Gemini break suggestion error:", error);
    return FALLBACK_BREAKS[Math.floor(Math.random() * FALLBACK_BREAKS.length)];
  }
};

export const getMotivationalQuote = async (theme: string, apiKey?: string): Promise<string> => {
  if (!apiKey) {
    return getFallbackQuote(theme);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.0-flash-lite-preview-02-05';
    const response = await ai.models.generateContent({
      model,
      contents: `Give me a very short, abstract, poetic motivational quote (max 10 words) that matches a "${theme}" aesthetic. No cliches.`,
    });
    return response.text?.trim() || getFallbackQuote(theme);
  } catch (error) {
    return getFallbackQuote(theme);
  }
}

