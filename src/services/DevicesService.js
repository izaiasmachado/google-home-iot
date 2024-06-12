const TelemetryService = require("./TelemetryService");

async function query(deviceId) {
  const state = await getDeviceState(deviceId);

  return {
    online: true,
    ...state,
  };
}

async function getDeviceState(deviceId) {
  switch (deviceId) {
    case "node-dht-temperature":
      return await getTemperatureSensorData();
    case "node-dht-humidity":
      return await getHumiditySensorData();
    case "node-relay":
      return await getDoorState();
  }
}

async function getTemperatureSensorData() {
  const sensorData = await TelemetryService.getSensorData();
  const temperatureAmbientCelsius = sensorData.temperature;

  return {
    online: true,
    temperatureAmbientCelsius,
  };
}

async function getHumiditySensorData() {
  const sensorData = await TelemetryService.getSensorData();
  const humidityAmbientPercent = sensorData.humidity;

  return {
    online: true,
    humidityAmbientPercent,
  };
}

async function getDoorState() {
  return {
    online: true,
    isLocked: false,
  };
}

module.exports = { query };
