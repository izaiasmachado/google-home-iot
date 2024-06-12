const SensorsService = require("./SensorsService");

async function query(deviceId) {
  switch (deviceId) {
    case "node-dht-temperature":
      return await getTemperatureSensorData();
    case "node-dht-humidity":
      return await getHumiditySensorData();
  }
}

async function getTemperatureSensorData() {
  const temperatureAmbientCelsius = await SensorsService.getTemperature();

  return {
    on: true,
    online: true,
    temperatureAmbientCelsius,
  };
}

async function getHumiditySensorData() {
  const humidityAmbientPercent = await SensorsService.getHumidity();
  return {
    on: true,
    online: true,
    humidityAmbientPercent,
  };
}

module.exports = { query };
