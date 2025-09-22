import { Link, Outlet } from 'react-router-dom'
import './App.css'


function App() {

  return (
    <>
      <h1>Commit To Memory</h1>
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/new_entry">New Entry</Link></li>
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
