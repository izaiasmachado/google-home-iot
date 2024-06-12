const axios = require("axios");

let sensorMeasurements;

const getLatestSensorData = async () => {
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

module.exports = { getLatestSensorData, getSensorData };
