import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './App.css';

function App() {
  // Initialize from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // Apply dark mode class and save preference
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3F5] via-[#FFF5E6] to-[#FFE4D6] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur border-b border-sky-200/50 dark:border-white/10 bg-gradient-to-r from-sky-50/80 via-blue-50/80 to-cyan-50/80 dark:from-slate-950/80 dark:via-slate-950/80 dark:to-slate-900/80">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <ul className="flex items-center gap-8 text-[#4A90A4] dark:text-cyan-200">
            <li>
              <Link to="/" className="hover:text-sky-600 dark:hover:text-white ring-focus font-semibold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/new_entry" className="hover:text-sky-600 dark:hover:text-white ring-focus font-semibold">
                New Entry
              </Link>
            </li>
          </ul>
          
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg bg-sky-100 dark:bg-slate-800 hover:bg-sky-200 dark:hover:bg-slate-700 transition-colors ring-focus shadow-sm"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <header className="pt-24 pb-8 text-center"> 
        <div className="inline-block p-8 border-3 border-transparent rounded-xl animate-neon-flash">
          <h1 className="font-display tracking-tight text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
            Commit To Memory
          </h1>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-slate-300">
          Track your projects &amp; todos &mdash; and keep the momentum.
        </p>
      </header>

      <main className="mx-auto max-w-6xl text-left px-4">
        <Outlet />
      </main>

      <footer className="mt-10 py-8 text-sm text-gray-500 dark:text-slate-400 text-center">
        <p>&copy; 2025 Commit To Memory &middot; Created by Brian Leach and Jamir Vega</p>
      </footer>
    </div>
  );
}

export default App;