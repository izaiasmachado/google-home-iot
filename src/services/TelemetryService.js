const axios = require("axios");
const AzureIoT = require("./AzureIoT");

let sensorMeasurements;

const mockSensorData = {
  temperature: 25,
  humidity: 50,
};

const getTelemetryData = async () => {
  const response = await axios.get(
    "https://azr-iot-data-consumption.azurewebsites.net/api/most_recent_consumption"
  );
  const createdAt = new Date(response.data.mostRecentData.EnqueuedTimeUtc);
  const timestamp = new Date();

  if (response.status !== 200) {
    throw new Error("Failed to get sensor data");
  }

  return {
    createdAt,
    timestamp,
    ...response.data.mostRecentData.Body,
  };
};

const getLatestSensorData = async () => {
  try {
    const sensorData = await getTelemetryData();
    return sensorData;
  } catch (error) {
    console.error("Failed to get sensor data", error);
    return mockSensorData;
  }
};

const getNextMeasurementTime = (lastMeasurement) => {
  if (!lastMeasurement) {
    return new Date();
  }

  return new Date(lastMeasurement.getTime() + 10 * 1000);
};

const getSensorData = async () => {
  const lastMeasurement = sensorMeasurements?.timestamp;
  const nextMeasurement = getNextMeasurementTime(lastMeasurement);
  const isTimeToGetNewData = new Date() > new Date(nextMeasurement);

  if (!sensorMeasurements || isTimeToGetNewData) {
    sensorMeasurements = await getLatestSensorData();
  }

  return sensorMeasurements;
};

let isDoorLocked = false;
let isLightOn = false;

const getDoorState = async () => {
  return isDoorLocked;
};

const getLightState = async () => {
  return isLightOn;
};

async function sendRelayState() {
  const lockStateBinary = isDoorLocked ? "0" : "1";
  const lightStateBinary = isLightOn ? "0" : "1";
  const payload = `${lockStateBinary}${lightStateBinary}`;
  await AzureIoT.sendMessage("relay", payload);
}

const changeDoorState = async (newState) => {
  isDoorLocked = newState;
  await sendRelayState();
};

const changeLightState = async (newState) => {
  isLightOn = newState;
  await sendRelayState();
};

module.exports = {
  getLatestSensorData,
  getSensorData,
  getDoorState,
  changeDoorState,
  getLightState,
  changeLightState,
};
