const axios = require("axios");

let sensorMeasurements;

const getLatestSensorData = async () => {
  const response = await axios.get(
    "https://azr-iot-data-consumption.azurewebsites.net/api/most_recent_consumption"
  );
  return response.data.mostRecentData.Body;
};

const getSensorData = async () => {
  const lastMeasurement = sensorMeasurements?.timestamp || 0;
  const nextMeasurement = lastMeasurement + 10000;
  const isTimeToGetNewData = new Date() > nextMeasurement;

  if (!sensorMeasurements || isTimeToGetNewData) {
    sensorMeasurements = await getLatestSensorData();
    sensorMeasurements.timestamp = new Date();
  }

  return sensorMeasurements;
};

module.exports = { getLatestSensorData, getSensorData };
