# AI PrepMaster 🚀

PrepMaster is a modern, responsive web application designed to help users prepare for technical and behavioral interviews. It features a sleek, glassmorphic UI with dynamic micro-animations, providing a premium experience for practicing coding, system design, and behavioral questions.

## ✨ Features

- **Personalized Dashboard**: Track your performance trends, hours practiced, and identify weak areas using dynamic radar and progress charts.
- **Question Bank**: Explore a curated list of interview questions categorized by topic (e.g., Dynamic Programming, System Design) and difficulty.
- **AI Mock Interview**: Practice behavioral questions with a simulated AI interviewer, featuring a distraction-free interface and timer.
- **Coding Sandbox**: Write and test your code directly in the browser with an interactive IDE-like interface.
- **Peer Practice & Leaderboard**: Compare your stats with top performers on the global leaderboard.
- **Resume Analyzer**: Upload your resume to receive instant feedback on ATS compatibility, keyword matches, and structural improvements.

## 🎨 Tech Stack & Design

- **Core**: HTML5, CSS3 (Vanilla), JavaScript (ES6 Modules)
- **Design System**: Custom CSS variables with a focus on high-contrast readability, glassmorphism (`backdrop-filter`), and fluid spacing.
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) for dynamic data visualization.

## 🚀 How to Run Locally

Since this is a vanilla frontend project utilizing ES6 modules (`type="module"`), it needs to be run through a local web server to avoid CORS issues.

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Open a terminal in the root folder of this project.
3. Run the following command to start a local server:
   ```bash
   npx serve frontend
   ```
4. Open your browser and navigate to the local address provided (typically `http://localhost:3000`).

## 📁 Project Structure

```
/frontend
│
├── /css
│   ├── style.css                 # Core design system, variables, and global layouts
│   └── /components
│       └── components.css        # Specific UI component styles (cards, stats grids)
│
├── /js
│   ├── main.js                   # Global logic, shared component injection (Sidebar, Header)
│   ├── mock-data.js              # Dummy data for UI prototyping
│   └── (page specific scripts)   # e.g., dashboard.js, question-bank.js
│
├── /pages
│   └── (html templates)          # Feature pages (Dashboard, Mock Session, etc.)
│
└── index.html                    # Landing page
```

## 🛠️ Recent Updates
- Enhanced typography and high-contrast color scheme for improved readability.
- Re-architected structural layout to properly support dynamic sidebars.
- Polished form elements, cards, and grid spacing to ensure a premium, non-rigid feel.
