import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import AlertHistory from "./pages/AlertHistory";
import Devices from "./pages/Devices";

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="*" element={<Navigate to="/login"/>} />
        </Routes>
      </Router>
    );
  }


  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <div className="layout">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/"        element={<Dashboard />} />
              <Route path="/alerts"  element={<AlertHistory />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="*"        element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
