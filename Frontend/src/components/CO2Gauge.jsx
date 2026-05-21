import { useEffect, useState, useContext } from "react";
import co from "../assets/co.png";
import { RoomContext } from "../context/RoomContext";
import { getCO2 } from "../services/telemetryService";


const WARNING_MAX = 1000;
const DANGER_MAX = 1500;
const MAX_VALUE = 2000;

function valueToAngle(val) {
  const clamped = Math.max(0, Math.min(val, MAX_VALUE));
  return -180 + (clamped / MAX_VALUE) * 180;
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const toRad = (d) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function CO2Gauge() {
  const { room } = useContext(RoomContext);
  const [value, setValue] = useState(0);
  const [avg, setAvg] = useState(null);

  useEffect(() => {
    setValue(0);
    setAvg(null);

    const fetchCO2Data = () => {
      getCO2(room)
        .then((res) => {
          const rows = Array.isArray(res.data) ? res.data : [];

          if (rows.length === 0) {
            setValue(0);
            setAvg(null);
            return;
          }

          setValue(Number(rows[rows.length - 1].value));

          const oneHourAgo = Date.now() - 60 * 60 * 1000;
          const recent = rows.filter((r) => new Date(r.timestamp).getTime() >= oneHourAgo);

          if (recent.length > 0) {
            const avgVal = recent.reduce((s, r) => s + Number(r.value), 0) / recent.length;
            setAvg(parseFloat(avgVal.toFixed(1)));
          }
        })


        .catch((err) => console.error("CO2 fetch error:", err));
    };

    fetchCO2Data();
    const interval = setInterval(fetchCO2Data, 3000);
    return () => clearInterval(interval);
  }, [room]);



  const cx = 160, cy = 145, r = 100, strokeW = 18;

  
  let status = "Normal";
  let statusClass = "co2-badge-normal";

  if (value === 0 && avg === null) {
    status = "No Data";
    statusClass = "co2-badge-nodata";
  } else if (value > DANGER_MAX) {
    status = "Danger";
    statusClass = "co2-badge-danger";
  } else if (value > WARNING_MAX) {
    status = "Warning";
    statusClass = "co2-badge-warning";
  }


  const segments = [
    { start: -180, end: valueToAngle(700), color: "#22c55e" },
    { start: valueToAngle(700), end: valueToAngle(1000), color: "#facc15" },
    { start: valueToAngle(1000), end: valueToAngle(1500), color: "#f97316" },
    { start: valueToAngle(1500), end: 0, color: "#ef4444" },
  ];

  

  const ticks = [0, 500, 1000, 1500, 2000];

  return (
    <div className="co2-card">


      <div className="co2-header">
        <div className="co2-title">
          <div className="co2-icon-box">
            <img src={co} alt="co2" className="co2-icon" />
          </div>
          <span className="co2-label">CO₂ Level</span>
        </div>
        <div className={`co2-status-badge ${statusClass}`}>
          <span className="co2-dot" />
          {status}
        </div>
      </div>


      <svg
        width="55%"
        viewBox="0 0 320 170"
        style={{ overflow: "visible", marginTop: "8px", marginLeft: "98px" }}
      >

        <path
          d={arcPath(cx, cy, r, -180, 0)}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        {segments.map((seg, i) => (
          <path
            key={i}
            d={arcPath(cx, cy, r, seg.start, seg.end)}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeLinecap={
              i === 0 ? "round" : i === segments.length - 1 ? "round" : "butt"
            }
          />
        ))}


        {ticks.map((tick) => {
          const angle = valueToAngle(tick);
          const rad = (angle * Math.PI) / 180;
          const lx = cx + (r + 22) * Math.cos(rad);
          const ly = cy + (r + 22) * Math.sin(rad);
          return (
            <text
              key={tick}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="#000000"
              fontWeight="500"
            >
              {tick}
            </text>
          );
        })}


        <g transform={`rotate(${valueToAngle(value) + 90}, ${cx}, ${cy})`}>
          <line
            x1={cx} y1={cy + 10}
            x2={cx} y2={cy - r + 14}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="8" fill="#000000" />
          <circle cx={cx} cy={cy} r="4" fill="white" />
        </g>


        <text
          x={cx}
          y={cy + 28}
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill="#6a9ef1"
        >
          {Math.round(value)}
        </text>
        <text
          x={cx + 36}
          y={cy + 24}
          textAnchor="start"
          fontSize="13"
          fill="#94a3b8"
          fontWeight="500"
        >
          ppm
        </text>

      </svg>


      <div className="co2-footer">
        <span className="co2-avg-label">Average (1H)</span>
        <span className="co2-avg-value">
          {avg !== null ? `${Math.round(avg)} ppm` : `${Math.round(value)} ppm`}
        </span>
      </div>

    </div>
  );
}

export default CO2Gauge;
