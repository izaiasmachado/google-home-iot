const DevicesService = require("./DevicesService");

async function sync() {
  return {
    agentUserId: "123",
    devices: [
      {
        id: "node-dht-temperature",
        type: "action.devices.types.SENSOR",
        traits: ["action.devices.traits.TemperatureControl"],
        name: {
          defaultNames: ["Sensor DHT11 - Temperature"],
          name: "Sensor DHT11 - Temperature",
          nicknames: ["Temperature"],
        },
        deviceInfo: {
          manufacturer: "Acme Co",
          model: "acme-washer",
          hwVersion: "1.0",
          swVersion: "1.0.1",
        },
        willReportState: true,
        attributes: {
          temperatureRange: {
            minThresholdCelsius: -20.0,
            maxThresholdCelsius: 60.0,
          },
          temperatureUnitForUX: "C",
        },
      },
      {
        id: "node-dht-humidity",
        type: "action.devices.types.SENSOR",
        traits: ["action.devices.traits.HumiditySetting"],
        name: {
          defaultNames: ["Sensor DHT11 - Humidity"],
          name: "Sensor DHT11 - Humidity",
          nicknames: ["Humidity"],
        },
        deviceInfo: {
          manufacturer: "Acme Co",
          model: "acme-washer",
          hwVersion: "1.0",
          swVersion: "1.0.1",
        },
        willReportState: true,
        attributes: {
          humiditySetpointRange: {
            minPercent: 0,
            maxPercent: 100,
          },
          queryOnlyHumiditySetting: true,
        },
      },
      {
        id: "relay",
        type: "action.devices.types.DOOR",
        traits: ["action.devices.traits.LockUnlock"],
        name: {
          defaultNames: ["Door"],
          name: "Door",
          nicknames: ["Door"],
        },
        deviceInfo: {
          manufacturer: "Acme Co",
          model: "acme-washer",
          hwVersion: "1.0",
          swVersion: "1.0.1",
        },
        willReportState: true,
        attributes: {
          discreteOnlyLockUnlock: true,
        },
      },
    ],
  };
}

async function query(input) {
  const devices = input.payload.devices;
  const deviceStates = {};

  const devicesPromises = devices.map(async (device) => {
    const state = await DevicesService.query(device.id);
    deviceStates[device.id] = state;
  });

  await Promise.all(devicesPromises);

  return {
    devices: deviceStates,
  };
}

async function execute(input) {
  const command = input.payload.commands[0];
  const commandResults = await executeCommand(command);

  return {
    commands: commandResults,
  };
}

async function executeCommand(command) {
  const { devices, execution } = command;

  const devicesPromises = devices.map((device) => {
    return DevicesService.execute(device, execution);
  });

  return await Promise.all(devicesPromises);
}

module.exports = { sync, query, execute };
