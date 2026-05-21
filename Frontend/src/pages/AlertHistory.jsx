import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertService";
import "../styles/alertHistory.css";

function AlertHistory() {
  const [alerts, setAlerts] = useState([]);

  
  useEffect(() => {
    getAlerts()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAlerts(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="history-container">
      <h2>Alert History</h2>

      <table className="alert-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>Metric</th>
            <th>Message</th>
            <th>Severity</th>
            <th>Time</th>
          </tr>
        </thead>


        <tbody>
          
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td>{alert.deviceId}</td>
              <td>{alert.metric}</td>
              <td>{alert.message}</td>
              <td>
                <span className={ alert.severity === "HIGH" ? "alert-severity-high": "alert-severity-medium"}>
                  {alert.severity}
                </span>
              </td>
              <td>{new Date(alert.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlertHistory;
