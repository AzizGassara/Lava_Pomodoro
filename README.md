# Lava Pomodoro

A visually distinctive Pomodoro timer with a flowing lava‑lamp background. Built with vanilla HTML, CSS, and JavaScript – no frameworks, no dependencies.

## Features

- **Pomodoro timer** – work/break cycles (default 25/5 minutes, fully customisable)
- **Lava‑lamp background** – a subtle, animated gradient that shifts colour and rotates, creating a relaxing visual effect
- **Audio notifications** – optional sound when a session ends
- **Responsive design** – works on desktop and mobile browsers
- **No build step** – just open `index.html` and start using

## How It Works

### Timer Logic (`js/script.js`)
- The timer runs in the browser using `setInterval`.  
- Work/break durations are stored in `localStorage` so preferences persist across sessions.  
- When a session ends, the timer automatically switches to the opposite mode (work → break → work) and loops until paused.  
- The UI updates every second, and a click on "Start" begins the countdown.

### Lava Effect (`css/style.css`)
The background is a CSS gradient animated via `@keyframes`:

```css
body {
  background: linear-gradient(45deg, #ff4e50, #f9d423, #ff4e50);
  background-size: 400% 400%;
  animation: lava 15s ease infinite;
}

@keyframes lava {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

The gradient moves horizontally, while the `background-size` creates a smooth, wave‑like transition – mimicking the flow of lava.

### Customisation
- **Work/break times** – click the gear icon and set your preferred minutes.  
- **Sound** – enabled by default; can be toggled off in settings.  
- **Colours** – modify the gradient stops in `style.css` to change the lava palette.

## Project Structure

```
Lava_Pomodoro/
├── index.html          # Main UI
├── css/
│   └── style.css       # Styling + lava animation
├── js/
│   └── script.js       # Timer logic, settings, sound
├── .gitignore
└── LICENSE
```

## Getting Started

1. Clone the repository:  
   `git clone https://github.com/AzizGassara/Lava_Pomodoro.git`
2. Open `index.html` in any modern browser.
3. Click "Start" and focus on your work while the lava flows.

## Contributing

Feel free to open issues or submit PRs for improvements – extra themes, keyboard shortcuts, or better accessibility.

## License

MIT – do whatever you like with it.
