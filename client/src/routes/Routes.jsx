// import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import Dashboard from '../components/Dashboard'
import Login from '../components/Login'
import Register from '../components/Signup'
import CreateNewMonitor from '../components/CreateNewMonitor'
import DashboardLayout from '../components/DashboardLayout'
import ViewMonitor from '../components/ViewMonitor'
import Incedents from '../components/Incedents'
import ProtectedRoute from './ProtectedRoute'
import PublicRouter from './PublicRouter'
import EditeMonitor from '../components/EditeMonitor'

function Routes_() {

  return (
    <>
      <Routes>  
            <Route element={<PublicRouter />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-new-monitor" element={<CreateNewMonitor />} />
                <Route path="/edit-monitor/:id" element={<EditeMonitor />} />
                <Route path="/monitor/:id" element={<ViewMonitor />} />
                <Route path="/incidents" element={<Incedents />} />
            </Route>
        </Route>
      </Routes>
    </>
  )
}

export default Routes_;
