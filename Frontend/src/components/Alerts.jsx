import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertService";
import { useNavigate } from "react-router-dom";
import "../styles/alerts.css";


function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAlerts = () => {
      getAlerts()
        .then((res) => setAlerts(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error(err));
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, [])


  const latest = alerts.slice(-1).reverse();

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <div className="alerts-title">
          <span className="alerts-bell"></span>
          Active Alerts
        </div>
        <span className="alert-count">{alerts.length}</span>
      </div>

      {alerts.length === 0 ? (
        <p className="no-alerts">No active alerts</p>
      ) : (
        latest.map((alert, index) => {
          const isHigh = alert.severity === "HIGH";
          return (
            <div key={index} className={`alert-card ${isHigh ? "high" : "medium"}`}>
              <div className="alert-icon-box">
                <span className={`alert-triangle ${isHigh ? "triangle-red" : "triangle-orange"}`}>⚠</span>
              </div>
              <div className="alert-content">
                <div className="alert-top-row">
                  <h4>{formatTitle(alert.metric)}</h4>
                  <span className={`alert-time ${isHigh ? "time-red" : "time-orange"}`}>{formatTime(alert.timestamp)}</span>
                </div>
                <p>{alert.message}</p>
              </div>
            </div>
          );
        })
      )}


      <div className="alert-footer">
        <span onClick={() => navigate("/alerts")} >View All Alerts History</span>
      </div>
    </div>
  );
}



function formatTitle(metric) {
  switch (metric) {
    case "co2_level": return "High CO₂ Level";
    case "light_intensity": return "Light Intensity Low";
    case "temperature": return "High Temperature";
    case "humidity": return "Humidity Alert";
    default: return metric;
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default Alerts;
