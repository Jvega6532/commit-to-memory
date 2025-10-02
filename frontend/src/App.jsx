import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3F5] via-[#FFF5E6] to-[#FFE4D6]">
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur border-b border-sky-200/50 bg-gradient-to-r from-sky-50/80 via-blue-50/80 to-cyan-50/80">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-center">
          <ul className="flex items-center gap-8 text-[#4A90A4]">
            <li>
              <Link to="/" className="hover:text-sky-600 font-semibold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/new_entry" className="hover:text-sky-600 font-semibold">
                New Entry
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <header className="pt-24 pb-8 text-center"> 
        <div className="inline-block p-8 border-3 border-transparent rounded-xl">
          <h1 className="font-display tracking-tight text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
            Commit To Memory
          </h1>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Track your projects &amp; todos &mdash; and keep the momentum.
        </p>
      </header>

      <main className="mx-auto max-w-6xl text-left px-4">
        <Outlet />
      </main>

      <footer className="mt-10 py-8 text-sm text-gray-500 text-center">
        <p>&copy; 2025 Commit To Memory &middot; Created by Brian Leach and Jamir Vega</p>
      </footer>
    </div>
  );
}

export default App;