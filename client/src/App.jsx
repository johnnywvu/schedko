import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

function App() {

  return (
    <>
      
      <Navbar />

      <Hero />

      <HowItWorks />

      <Footer />
      
    </>
  )
}

export default App
