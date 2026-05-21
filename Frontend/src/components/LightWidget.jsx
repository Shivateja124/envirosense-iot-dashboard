import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { getLightIntensity } from "../services/telemetryService";

function LightWidget() {
  const { room } = useContext(RoomContext);
  const [light, setLight] = useState(0);
  const [avg, setAvg]     = useState(0);
  const [min, setMin]     = useState(0);
  const [max, setMax]     = useState(0);
  const [hasData, setHasData] = useState(false);


  useEffect(() => {
    setLight(0);
    setAvg(0);
    setMin(0);
    setMax(0);
    setHasData(false);

    const fetchLight = () => {
      getLightIntensity(room)
        .then((res) => {
          const rows = Array.isArray(res.data) ? res.data : [];

          if (rows.length === 0) {
            setLight(0);
            setAvg(0);
            setMin(0);
            setMax(0);
            setHasData(false);
            return;
          }

          setHasData(true);
          setLight(Number(rows[rows.length-1].value));

          const oneHourAgo = Date.now() - 60 * 60 * 1000;
          const recent = rows.filter((r) => new Date(r.timestamp).getTime() >= oneHourAgo);
          
          if(recent.length>0){
            const avg=recent.reduce((s,r)=>s+Number(r.value),0)/recent.length;
            setAvg(parseFloat(avg.toFixed(1)));
            
          }else{
            setAvg(0);
          }

          const values = rows.map(r => Number(r.value));
          setMin(Math.min(...values).toFixed(1));
          setMax(Math.max(...values).toFixed(1));
        })
        .catch((err) => console.log(err));
    };

    fetchLight();
    const interval = setInterval(fetchLight, 3000);
    return () => clearInterval(interval);
  }, [room]);




let status = "Normal";
let statusClass = "light-badge-normal";

if (!hasData) {
  status = "No Data";
  statusClass = "light-badge-nodata";
} else if (light > 500) {
  status = "Bright";
  statusClass = "light-badge-warning";
} else if (light < 100) {
  status = "Dark";
  statusClass = "light-badge-dark";
}

  return (
    <div className="light-card">

      <div className="light-header">
        <div className="light-title">
          <div className="light-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="#f97316" />
              <line x1="12" y1="2"  x2="12" y2="5"  stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="19" x2="12" y2="22" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="2"  y1="12" x2="5"  y2="12" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="19" y1="12" x2="22" y2="12" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="light-label">Light Intensity</span>
        </div>
        <div className={`light-status-badge ${statusClass}`}>
          <span className="light-dot" />
          {status}
        </div>
      </div>

      <div className="light-body">
        <div className="light-sun-wrapper">
          <svg viewBox="0 0 100 100" width="110" height="110">
            <defs>
              <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#fde68a" />
                <stop offset="60%"  stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </radialGradient>
            </defs>

            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1={50 + 28 * Math.cos(rad)}
                  y1={50 + 28 * Math.sin(rad)}
                  x2={50 + 42 * Math.cos(rad)}
                  y2={50 + 42 * Math.sin(rad)}
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}

            <circle cx="50" cy="50" r="22" fill="url(#sunGrad)" />
            <ellipse
              cx="43" cy="43" rx="6" ry="4"
              fill="white" opacity="0.3"
              transform="rotate(-30 43 43)"
            />
          </svg>
        </div>

        <div className="light-values">
          <div className="light-current">
            <span className="light-value">
              {hasData ? Number(light).toFixed(0) : "--"}
            </span>
            <span className="light-unit">{hasData ? " lux" : ""}</span>
          </div>
          <div className="light-avg-box">
            <span className="light-avg-label">Average (1H)</span>
            <span className="light-avg-value">
              {hasData ? `${avg} lux` : "--"}
            </span>
          </div>
        </div>
      </div>


      <div className="light-footer">
        <span>Min &nbsp;<strong>{hasData ? `${min} lux` : "--"}</strong></span>
        <span>Max &nbsp;<strong>{hasData ? `${max} lux` : "--"}</strong></span>
      </div>

    </div>
  );
}

export default LightWidget;
