import { useEffect, useState, useContext } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import temperature from "../assets/temperature.png";
import { RoomContext } from "../context/RoomContext";
import { getTemperature } from "../services/telemetryService";

const TEMP_MIN = 18;
const TEMP_MAX = 30;

function TemperatureChart() {
  const { room } = useContext(RoomContext);
  const [data, setData] = useState([]);
  const [avg, setAvg]   = useState(null);

  useEffect(() => {
    setData([]);
    setAvg(null);

    const fetchTemperatureData = () => {
      getTemperature(room)
        .then((res) => {
          const rows = Array.isArray(res.data) ? res.data : [];

          if (rows.length === 0) {
            setData([]);
            setAvg(null);
            return;
          }


          const bucketMap = {};

          rows.forEach((item) => {
            const d = new Date(item.timestamp);
            d.setMinutes(Math.floor(d.getMinutes() / 10) * 10);
            d.setSeconds(0);
            d.setMilliseconds(0);

            const key = d.toTimeString().substring(0, 5);
            if (!bucketMap[key]) bucketMap[key] = [];
            bucketMap[key].push(Number(item.value));
          });

          const finalData = Object.keys(bucketMap)
            .sort()
            .slice(-6)
            .map((key) => {
              const vals = bucketMap[key];
              return {
                time: key,
                value: parseFloat(
                  (vals.reduce((a, c) => a + c, 0) / vals.length).toFixed(2)
                ),
              };
            });


          setData(finalData);

          const oneHourAgo = Date.now() - 60 * 60 * 1000;
          const recent = rows.filter((r) => new Date(r.timestamp).getTime() >= oneHourAgo);

          if (recent.length > 0) {
            const avgVal =recent.reduce((s, r) => s + Number(r.value), 0) / recent.length;
            setAvg(parseFloat(avgVal.toFixed(1)));
          } else {
            setAvg(null);
          }
        })
        .catch((err) => console.error("Temperature fetch error:", err));
    };

    fetchTemperatureData();
    const interval = setInterval(fetchTemperatureData, 3000);
    return () => clearInterval(interval);
  }, [room]);

  const validValues = data.filter((d) => d.value !== null).map((d) => d.value);
  const min      = validValues.length > 0 ? Math.min(...validValues) : null;
  const max      = validValues.length > 0 ? Math.max(...validValues) : null;
  const isNormal = avg !== null && avg >= TEMP_MIN && avg <= TEMP_MAX;

  return (
    <div className="temp-chart-card">

      <div className="temp-chart-header">
        <div className="temp-chart-title">
          <div className="temp-icon-box">
            <img className="temp-icon" src={temperature} alt="temp" />
          </div>
          <span className="temp-label">Temperature</span>
           <span className="avg-title">Avg(1H)</span>
          <div className="temp-current">
            {avg !== null ? (
              <>

                <span className="temp-value">{avg}</span>
                <span className="temp-unit"> °C</span>
              </>
            ) : (
              <span className="temp-no-data">No data available</span>
            )}
          </div>
        </div>

        <div className={`temp-status-badge ${isNormal ? "normal" : "danger"}`}>
          <span className="status-dot" />
          {avg === null ? "No Data" : isNormal ? "Normal" : "Danger"}
        </div>
      </div>

      <div className="temp-chart-area" style={{ width: "100%", height: 140 }}>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#f3f4f6"
              strokeDasharray="4 4"
              vertical={false}
              horizontalValues={[22, 24, 26, 28, 30]}
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#000000" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[22, 30]}
              ticks={[22, 24, 26, 28, 30]}
              tickCount={5}
              tick={{ fontSize: 11, fill: "#000000" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              width={32}
            />

            <Tooltip
              formatter={(val) =>
                val !== null ? [`${Number(val).toFixed(1)} °C`, "Temp"] : ["N/A", "Temp"]
              }
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                fontSize: "13px",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#tempGradient)"
              dot={{ r: 3.5, fill: "#ef4444", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#ef4444" }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="temp-chart-footer">
        <span className="temp-min" style={{ color: "#000000" }}>
          Min &nbsp;
          <strong style={{ color: "#000000" }}>
            {min !== null ? `${min.toFixed(1)} °C` : "--"}
          </strong>
        </span>
        <span className="temp-max" style={{ color: "#000000" }}>
          Max &nbsp;
          <strong style={{ color: "#000000" }}>
            {max !== null ? `${max.toFixed(1)} °C` : "--"}
          </strong>
        </span>
      </div>

    </div>
  );
}

export default TemperatureChart;
