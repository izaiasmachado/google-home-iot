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
    case "relay":
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
    isLocked: await TelemetryService.getDoorState(),
  };
}

async function execute(device, execution) {
  const deviceId = device.id;

  switch (deviceId) {
    case "relay":
      return await executeRelayCommand(device, execution);
    default:
      return {
        ids: [deviceId],
        status: "ERROR",
        errorCode: "deviceNotFound",
      };
  }
}

async function executeRelayCommand(device, execution) {
  const actualExecution = execution[0];
  const command = actualExecution.command;
  const params = actualExecution.params;

  switch (command) {
    case "action.devices.commands.LockUnlock":
      return {
        ids: [device.id],
        status: "SUCCESS",
        lock: await changeDoorState(params.lock),
      };
    default:
      return {
        ids: [device.id],
        status: "ERROR",
        errorCode: "commandNotSupported",
      };
  }
}

async function changeDoorState(state) {
  await TelemetryService.changeDoorState(state);
  const isLocked = await TelemetryService.getDoorState();

  return {
    online: true,
    isLocked,
  };
}

module.exports = { query, execute };
