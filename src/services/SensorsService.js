const TelemetryService = require("./TelemetryService");

async function getTemperature() {
  const sensorData = await TelemetryService.getSensorData();
  return sensorData.temperature;
}

async function getHumidity() {
  const sensorData = await TelemetryService.getSensorData();
  return sensorData.humidity;
}

module.exports = {
  getTemperature,
  getHumidity,
};
