import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import Schedule from './components/Schedule'

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <HowItWorks />
          </>
        } />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
