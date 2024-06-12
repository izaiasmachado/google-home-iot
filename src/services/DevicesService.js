const TelemetryService = require("./TelemetryService");

async function query(deviceId) {
  switch (deviceId) {
    case "node-dht-temperature":
      return await getTemperatureSensorData();
    case "node-dht-humidity":
      return await getHumiditySensorData();
  }
}

function isDeviceOnline(lastUpdate) {
  return new Date() - lastUpdate < 5 * 60 * 1000;
}

async function getTemperatureSensorData() {
  const sensorData = await TelemetryService.getSensorData();
  const temperatureAmbientCelsius = sensorData.temperature;
  const online = isDeviceOnline(sensorData.createdAt);
  return {
    online,
    temperatureAmbientCelsius,
  };
}

async function getHumiditySensorData() {
  const sensorData = await TelemetryService.getSensorData();
  const humidityAmbientPercent = sensorData.humidity;
  const online = isDeviceOnline(sensorData.createdAt);

  return {
    online,
    humidityAmbientPercent,
  };
}

module.exports = { query };
