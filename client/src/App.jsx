import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Signup'
import CreateNewMonitor from './components/CreateNewMonitor'
import DashboardLayout from './components/DashboardLayout'
import ViewMonitor from './components/ViewMonitor'
import Incedents from './components/Incedents'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes that share the Slidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-new-monitor" element={<CreateNewMonitor />} />
          <Route path="/monitor/:id" element={<ViewMonitor />} />
          <Route path="/incidents" element={<Incedents />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
