import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Risk from './pages/Risk'
import Dashboard from './pages/Dashboard'
import Medications from './pages/Medications'
import Reports from './pages/Reports'
import LogReading from './pages/LogReading'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/risk" element={<Risk />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/medications" element={<Medications />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/log" element={<LogReading />} />
    </Routes>
  )
}
