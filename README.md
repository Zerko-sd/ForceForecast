# Force Forecast

Harness the Dark Side. Dominate Your Day.

Force Forecast is a Star Wars-inspired productivity app that combines AI-powered planning, a tactical chat advisor, Pomodoro timer, and an immersive music player to help you conquer your daily goals.

## Features

- **Mission Directive:** Generate a personalized daily plan using Google Gemini AI.
- **Tactical Schedule:** View your AI-generated schedule and goals for the day.
- **Mindset Conditioning:** Get a motivational journal prompt and space to reflect.
- **Tactical Advisor (Chatbot):** Chat with a Sith-inspired AI advisor for focus, motivation, and productivity tips.
- **Pomodoro Timer:** Stay productive with a customizable Pomodoro timer.
- **Imperial Soundtracks:** Play epic, ambient, and focus music while you work.
- **Calendar, Game, and More:** Additional tools for planning and engagement.

## Tech Stack
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **@google/genai** (Gemini API)

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/force-forecast.git
cd force-forecast
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root:
```
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
- Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Add Music Files (Optional)
- Place your MP3 files in the `public/assets/` directory.
- Reference them in `src/components/PomodoroSidebar.tsx` as `/assets/yourfile.mp3`.

### 5. Run the App
```sh
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage
- Enter your mission directive and click **Execute Force Forecast** to generate your plan.
- Open the **Tactical Advisor** to chat with the AI.
- Use the **Pomodoro Timer** and play music to stay focused.
- Save, export, or clear your plans as needed.

## Screenshots
_Add screenshots here if desired._

## License
MIT

---

**May the Force (and your productivity) be with you!** 