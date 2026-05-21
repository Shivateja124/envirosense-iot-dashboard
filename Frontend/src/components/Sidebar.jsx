import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">

      <div
        className={`menu-item ${isActive("/") ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        <div className="item">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /> <rect x="14" y="3" width="7" height="7" /> <rect x="14" y="14" width="7" height="7" /> <rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </div>

      </div>

      <div
        className={`menu-item ${isActive("/devices") ? "active" : ""}`}
        onClick={() => navigate("/devices")}
      >
        <div className="item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <line x1="12" y1="16" x2="12" y2="20" />
            <line x1="8" y1="20" x2="16" y2="20" />
            <circle cx="8" cy="9" r="1.2" />
            <circle cx="12" cy="9" r="1.2" />
            <circle cx="16" cy="9" r="1.2" />
          </svg>
          All Devices
        </div>

      </div>

      <div
        className={`menu-item ${isActive("/alerts") ? "active" : ""}`}
        onClick={() => navigate("/alerts")}
      >

        <div className="item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Alert History
        </div>

      </div>

    </div>
  );
}

export default Sidebar;
