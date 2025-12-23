export const SOUNDS = {
  add: 'https://actions.google.com/sounds/v1/water/water_drop.ogg',
  complete: 'https://actions.google.com/sounds/v1/reveals/clean_reveal_01.ogg',
  delete: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
  start: 'https://actions.google.com/sounds/v1/ui/beep_start.ogg',
  pause: 'https://actions.google.com/sounds/v1/ui/button_click_off.ogg',
  reset: 'https://actions.google.com/sounds/v1/ui/button_click_on.ogg',
  finish: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
  click: 'https://actions.google.com/sounds/v1/ui/button_click_on.ogg',
  ai: 'https://actions.google.com/sounds/v1/science_fiction/scifi_communication_burst.ogg'
};

export const playSound = (type: keyof typeof SOUNDS) => {
  try {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {
        // Autoplay policy might block this if no interaction
    });
  } catch (e) {
    console.error("Audio playback error", e);
  }
};