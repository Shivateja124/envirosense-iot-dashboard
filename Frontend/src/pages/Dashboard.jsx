import "../styles/dashboard.css";

import temperature from "../assets/temperature.png";
import humidity from "../assets/humidity.png";
import co from "../assets/co.png";
import intensity from "../assets/intensity.png";
import TemperatureChart from "../components/TemperatureChart";
import CO2Gauge from "../components/CO2Gauge";
import HumidityWidget from "../components/HumidityWidget";
import LightWidget from "../components/LightWidget";
import Alerts from "../components/Alerts";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="card-container">
        <div className="card">
          <img className="card-img-red" src={temperature} alt="temp" />
          <div className="card-text">
            <h4>Avg Temperature</h4>
            <div className="card-value-red">26.3 °C</div>
          </div>
        </div>

        <div className="card">
          <img className="card-img-blue" src={humidity} alt="humidity" />
          <div className="card-text">
            <h4>Avg Humidity</h4>
            <div className="card-value-blue">55 %</div>
          </div>
        </div>

        <div className="card">
          <img className="card-img-purple" src={co} alt="co2" />
          <div className="card-text">
            <h4>Avg CO₂ Level</h4>
            <div className="card-value-purple">600 ppm</div>
          </div>
        </div>

        <div className="card">
          <img className="card-img-orange" src={intensity} alt="light" />
          <div className="card-text">
            <h4>Avg Light Intensity</h4>
            <div className="card-value-orange">310 lux</div>
          </div>
        </div>
      </div>



      <div className="chart-container">

        <div className="temp-chart-box">
          <TemperatureChart />
        </div>

        <div className="co-chart-box">
          <CO2Gauge />
        </div>

        <div className="bottom-row">
          <div className="chart-box"><HumidityWidget /></div>
          <div className="chart-box"><LightWidget /></div>
          <div className="chart-box"><Alerts /></div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
