import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { getHumidity } from "../services/telemetryService";

function HumidityWidget() {
  const { room } = useContext(RoomContext);

  const [humidity, setHumidity] = useState(0);
  const [avg, setAvg] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [hasData, setHasData] = useState(false);


  useEffect(() => {
    setHumidity(0);
    setAvg(0);
    setMin(0);
    setMax(0);
    setHasData(false);


    const fetchHumidity = () => {
      getHumidity(room)
        .then((res) => {
          const rows = Array.isArray(res.data) ? res.data : [];

          if (rows.length === 0) {
            setHumidity(0);
            setAvg(0);
            setMin(0);
            setMax(0);
            setHasData(false);
            return;
          }

          setHasData(true);
          setHumidity(Number(rows[rows.length - 1].value));

          

          const oneHourAgo=Date.now()-60*60*1000;
          const recent=rows.filter((r)=>new Date(r.timestamp).getTime()>=oneHourAgo);

          if(recent>0){
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

    fetchHumidity();
    const interval = setInterval(fetchHumidity, 3000);
    return () => clearInterval(interval);
  }, [room]);



  let status = "Normal";
  let statusClass = "hum-badge-normal";

  if (!hasData) {
    status = "No Data";
    statusClass = "hum-badge-nodata";
  } else if (humidity > 70) {
    status = "High";
    statusClass = "hum-badge-danger";
  } else if (humidity < 30) {
    status = "Low";
    statusClass = "hum-badge-warning";
  }



  const fillPct = Math.min(85, Math.max(20, humidity * 0.65 + 20));

  return (
    <div className="hum-card">

      <div className="hum-header">
        <div className="hum-title">
          <div className="hum-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2Z"
                fill="#60a5fa"
                opacity="0.9"
              />
            </svg>
          </div>
          <span className="hum-label">Humidity</span>
        </div>
        <div className={`hum-status-badge ${statusClass}`}>
          <span className="hum-dot" />
          {status}
        </div>
      </div>

      <div className="hum-body">
        <div className="hum-drop-wrapper">
          <svg viewBox="0 0 100 120" width="110" height="130">
            <defs>
              <clipPath id="dropClip">
                <path d="M50 5 C50 5 10 55 10 78 a40 40 0 0 0 80 0 C90 55 50 5 50 5Z" />
              </clipPath>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            <path
              d="M50 5 C50 5 10 55 10 78 a40 40 0 0 0 80 0 C90 55 50 5 50 5Z"
              fill="#dbeafe"
              stroke="#93c5fd"
              strokeWidth="1.5"
            />
            <rect
              x="10"
              y={118 - fillPct}
              width="80"
              height={fillPct}
              fill="url(#waterGrad)"
              clipPath="url(#dropClip)"
              opacity="0.85"
            />
            <ellipse
              cx="36" cy="52" rx="7" ry="12"
              fill="white" opacity="0.3"
              transform="rotate(-20 36 52)"
            />
          </svg>
        </div>

        <div className="hum-values">
          <div className="hum-current">
            <span className="hum-value">
              {hasData ? Number(humidity).toFixed(1) : "--"}
            </span>
            <span className="hum-unit">{hasData ? " %" : ""}</span>
          </div>
          <div className="hum-avg-box">
            <span className="hum-avg-label">Average (1H)</span>
            <span className="hum-avg-value">
              {hasData ? `${avg} %` : "--"}
            </span>
          </div>
        </div>
      </div>

      <div className="hum-footer">
        <span>Min &nbsp;<strong>{hasData ? `${min} %` : "--"}</strong></span>
        <span>Max &nbsp;<strong>{hasData ? `${max} %` : "--"}</strong></span>
      </div>

    </div>
  );
}

export default HumidityWidget;
