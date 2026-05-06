import API from "./api";

export const getTemperature    = (room) => API.get(`/telemetry/metric/temperature?location=${encodeURIComponent(room)}`);
export const getCO2            = (room) => API.get(`/telemetry/metric/co2_level?location=${encodeURIComponent(room)}`);
export const getHumidity       = (room) => API.get(`/telemetry/metric/humidity?location=${encodeURIComponent(room)}`);
export const getLightIntensity = (room) => API.get(`/telemetry/metric/light_intensity?location=${encodeURIComponent(room)}`);