# OrganQuest - The Human Anatomy Explorer

An interactive React application for exploring human anatomy through an engaging and educational interface.

## 🎯 Project Overview

OrganQuest is an educational web application that makes learning human anatomy fun and interactive. The app features floating organ animations, interactive components, and will include routing and detailed organ exploration (to be implemented).

## 🚀 Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## ✨ Features

- 🎨 **Beautiful UI**: Dark purple gradient background with floating organ animations
- 🫀 **Interactive Organs**: 5 animated organ components (Heart, Lungs, Brain, Liver, Kidney)
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ⚡ **Fast Development**: Powered by Vite for instant hot reload
- 🎯 **Structured Architecture**: Organized with components, pages, and assets folders
- 🎭 **Smooth Animations**: CSS-based floating animations with different timing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Organ.jsx       # Organ component with props (src, name, style)
│   └── Organ.css       # Floating animations and organ styling
├── pages/              # Page components
│   ├── Home.jsx        # Main landing page
│   └── Home.css        # Home page styling
├── assets/             # Static assets
│   └── images/         # Organ SVG illustrations
│       ├── heart.svg
│       ├── lungs.svg
│       ├── brain.svg
│       ├── liver.svg
│       └── kidney.svg
├── App.jsx             # Main app component
├── App.css             # Global app styles
├── main.jsx            # Entry point
└── index.css           # Global styles and resets
```

## 🎨 Component Usage

### Organ Component
```jsx
import Organ from './components/Organ';

<Organ 
  src={heartImg} 
  name="Heart" 
  style={{ top: '15%', right: '20%' }}
  className="float-1"
/>
```

## 🔮 Future Enhancements

- 🧭 **React Router**: Navigation between different organ detail pages
- 🔍 **Organ Details**: Detailed information and interactive features for each organ
- 🎮 **Quiz Mode**: Educational quizzes about human anatomy
- 🎵 **Sound Effects**: Audio feedback for interactions
- 📊 **Progress Tracking**: User progress and learning statistics

## 🎯 Current Status

✅ **Foundation Complete**:
- Project structure with organized folders
- Organ component with customizable props
- 5 floating organ animations
- Dark purple themed UI with centered "Get Started" button
- Responsive design for all devices

🚧 **Ready for Next Phase**:
- Implementation of React Router for navigation
- Development of individual organ detail pages
- Addition of interactive learning features
