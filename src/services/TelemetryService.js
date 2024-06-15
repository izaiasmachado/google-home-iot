const axios = require("axios");
const AzureIoT = require("./AzureIoT");
const logger = require("../utils/logger");

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
    logger.error("Failed to get sensor data", error);
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

let isDoorLocked = true;
let isLightOn = false;

const getDoorState = async () => {
  return isDoorLocked;
};

const getLightState = async () => {
  return isLightOn;
};

async function sendDoorState() {
  const payload = isDoorLocked ? "1X" : "0X";
  await AzureIoT.sendMessage("relay", payload);
}

async function sendLightState() {
  const payload = isLightOn ? "X0" : "X1";
  await AzureIoT.sendMessage("relay", payload);
}

async function openDoorTemporarily() {
  console.log("Opening door");
  await AzureIoT.sendMessage("relay", "2X");
}

const changeDoorState = async (newState) => {
  isDoorLocked = newState;
  await sendDoorState();
};

const changeLightState = async (newState) => {
  isLightOn = newState;
  await sendLightState();
};

module.exports = {
  getLatestSensorData,
  getSensorData,
  getDoorState,
  changeDoorState,
  getLightState,
  changeLightState,
  openDoorTemporarily,
};
