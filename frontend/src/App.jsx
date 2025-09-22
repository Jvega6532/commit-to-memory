import { Link, Outlet } from 'react-router-dom'
import './App.css'


function App() {

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between flex-wrap bg-gray-800 text-white p-6 shadow-md z-50">
        <ul className="flex justify-center space-x-10">
          <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
          <li><Link to="/new_entry" className="hover:text-gray-300">New Entry</Link></li>
        </ul>
      </nav>


      <header>

        <h1 className="text-5xl font-extrabold text-indigo-600 text-center mt-6 mb-6 fade-in">
        Commit To Memory
      </h1>
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
