import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import NewEntry from './NewEntry.jsx'
import Entry from './Entry.jsx'

{/*
  We will need to set up the routes for NewEntry and Entry here
  We will only have NewEntry accesible in the Nav bar
  Entry will be accessed by clicking on an entry in the Home page
  */}

createRoot(document.getElementById('root')).render(




  < StrictMode >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< App />}>
          <Route index element={<Home />} />
          <Route path="/new_entry" element={<NewEntry />} />
          <Route path="/entries/:entryId" element={<Entry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode >
)
