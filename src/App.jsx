import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import DailyReport from './pages/DailyReport'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="2026-02/:date" element={<DailyReport />} />
      </Route>
    </Routes>
  )
}

export default App
