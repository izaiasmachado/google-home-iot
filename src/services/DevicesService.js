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
    case "node-relay-door":
      return await getDoorState();
    case "node-relay-light":
      return await getLightState();
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

async function getLightState() {
  return {
    online: true,
    on: await TelemetryService.getLightState(),
  };
}

async function execute(device, execution) {
  const deviceId = device.id;

  switch (deviceId) {
    case "node-relay-door":
      return await executeCommand(device, execution);
    case "node-relay-light":
      return await executeCommand(device, execution);
    case "node-doorbell":
      return await executeCommand(device, execution);
    default:
      return {
        ids: [deviceId],
        status: "ERROR",
        errorCode: "deviceNotFound",
      };
  }
}

async function executeCommand(device, execution) {
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
    case "action.devices.commands.OnOff":
      return {
        ids: [device.id],
        status: "SUCCESS",
        on: await changeLightState(params.on),
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

async function changeLightState(state) {
  await TelemetryService.changeLightState(state);
  const on = await TelemetryService.getLightState();

  return {
    online: true,
    on,
  };
}

module.exports = { query, execute };
