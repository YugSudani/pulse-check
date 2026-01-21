// import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Register from "../components/Signup";
import CreateNewMonitor from "../components/CreateNewMonitor";
import DashboardLayout from "../components/DashboardLayout";
import ViewMonitor from "../components/ViewMonitor";
import Incedents from "../components/Incedents";
import ProtectedRoute from "./ProtectedRoute";
import PublicRouter from "./PublicRouter";
import EditeMonitor from "../components/EditeMonitor";
import OtpVerification from "../components/OtpVerify";
import Features from "../components/staticComps/Features";
import Solutions from "../components/staticComps/Solutions";
import Resources from "../components/staticComps/Resourses";
import Pricing from "../components/staticComps/Pricing";
import ScrollToTop from "./ScrollToTop";
import NotFound from "../components/NotFound";

function Routes_() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicRouter />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otpverification/:email" element={<OtpVerification />} />
        </Route>
          
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/pricing" element={<Pricing />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/create-new-monitor" element={<CreateNewMonitor />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-monitor/:id" element={<EditeMonitor />} />
            <Route path="/monitor/:id" element={<ViewMonitor />} />
            <Route path="/incidents" element={<Incedents />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Routes_;
