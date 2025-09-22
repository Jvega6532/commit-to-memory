import { Link, Outlet } from 'react-router-dom'
import './App.css'


function App() {

  return (
    <>
      <h1 className="text-5xl font-extrabold text-center text-indigo-600 mt-6 mb-4 animate-bounce">
        Commit To Memory
      </h1>
      <header>
        <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 shadow-md z-50">
          <ul className="flex justify-center space-x-6">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/new_entry" className="hover:text-gray-300">New Entry</Link></li>
          </ul>
        </nav>

      </header>
      <main>
        <Outlet />
      </main>
      <br></br>
      <footer>
        <p>© 2025 Commit To Memory | Created by Brian Leach and Jamir Vega</p>
      </footer>

    </>
  )
}

export default App
