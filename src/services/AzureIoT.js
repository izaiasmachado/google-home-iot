const { Client } = require("azure-iothub");
const { Message } = require("azure-iot-common");

class AzureIoTClient {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.listeners = [];
    this.client = Client.fromConnectionString(connectionString);
    this.init();
  }

  async init() {
    await this.open();
  }

  async open() {
    return new Promise((resolve, reject) => {
      this.client.open((err) => {
        if (err) {
          console.log("Failed to open the connection to Azure IoT Hub");
          return reject(err);
        }

        console.log("Connection to Azure IoT Hub opened");
        resolve();
      });
    });
  }

  async sendMessage(deviceId, rawMessage) {
    return new Promise((resolve, reject) => {
      const message = new Message(rawMessage);
      this.client.send(deviceId, message, (err) => {
        if (err) {
          console.log(`Failed to send message to ${deviceId}`);
          return reject(err);
        }
        console.log(`Message sent to ${deviceId}`);
        resolve();
      });
    });
  }
}

const { AZURE_IOT_HUB_CONNECTION_STRING } = require("../utils/environment");
module.exports = new AzureIoTClient(AZURE_IOT_HUB_CONNECTION_STRING);
