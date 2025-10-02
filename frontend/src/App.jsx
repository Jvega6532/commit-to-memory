import { Link, Outlet } from 'react-router-dom';


function App() {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur border-b border-slate-200/70 dark:border-white/10
                       bg-gradient-to-r from-white via-sky-50 to-sky-100
                       dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-center">
          <ul className="flex items-center gap-8 text-slate-700 dark:text-slate-200">
            <li><Link to="/" className="hover:text-slate-900 dark:hover:text-white ring-focus">Home</Link></li>
            <li><Link to="/new_entry" className="hover:text-slate-900 dark:hover:text-white ring-focus">New Entry</Link></li>
          </ul>
        </div>
      </nav>

      <header className="pt-24 pb-4">
        <div className="mx-auto max-w-6xl text-center px-4">
          <h1
            className="fade-in font-display tracking-tight text-5xl font-extrabold text-transparent bg-clip-text
                 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-800 drop-shadow-sm"
          >
            Commit To Memory
          </h1>

          <div className="mx-auto mt-3 sm:mt-4 w-48 sm:w-64 px-4">
            <div className="divider-brand divider-animated divider-shimmer" />
          </div>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Track your projects & todos — and keep the momentum.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl text-left">
        <Outlet />
      </main>

      <footer className="mt-10 py-8 text-sm text-slate-500 dark:text-slate-400">
        <div className="mx-auto max-w-6xl text-center px-4">
          <p>© 2025 Commit To Memory · Created by Brian Leach and Jamir Vega</p>
        </div>
      </footer>
    </>
  )
}

export default App
