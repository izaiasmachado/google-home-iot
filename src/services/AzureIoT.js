const connectionString = process.env.AZURE_IOT_HUB_CONNECTION_STRING;

const { Client } = require("azure-iothub");
const { Message } = require("azure-iot-common");

const client = Client.fromConnectionString(connectionString);

function sendMessage(deviceId, rawMessage) {
  return new Promise((resolve, reject) => {
    client.open((err) => {
      if (err) {
        console.log("Failed to open the connection to Azure IoT Hub");
        return reject(err);
      }

      console.log("Connection to Azure IoT Hub opened");

      const message = new Message(rawMessage);
      client.send(deviceId, message, (err) => {
        if (err) {
          console.log(`Failed to send message to ${deviceId}`);
          return reject(err);
        }
        console.log(`Message sent to ${deviceId}`);
        resolve();
      });
    });
  });
}

module.exports = { sendMessage };
