import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import './App.css'

{/*
  We will need to set up the routes for NewEntry and Entry here
  We will only have NewEntry accesible in the Nav bar
  Entry will be accessed by clicking on an entry in the Home page
  */}




function App() {

  return (
    <>
      <h1>Commit To Memory</h1>
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/entries">Entries</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <br></br>
      <footer>
        <p>© 2024 Commit To Memory | Created by Brian Leach and Jamir Vega</p>
      </footer>

    </>
  )
}

export default App
