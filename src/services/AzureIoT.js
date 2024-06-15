const logger = require("../utils/logger");
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
          logger.error("Failed to open the connection to Azure IoT Hub", err);
          return reject(err);
        }

        logger.info("Connection to Azure IoT Hub opened");
        resolve();
      });
    });
  }

  async sendMessage(deviceId, rawMessage) {
    return new Promise((resolve, reject) => {
      const message = new Message(rawMessage);
      this.client.send(deviceId, message, (err) => {
        if (err) {
          logger.error(`Failed to send message to ${deviceId}`, err);
          return reject(err);
        }
        logger.info(`Message sent to ${deviceId}`);
        resolve();
      });
    });
  }
}

const { AZURE_IOT_HUB_CONNECTION_STRING } = require("../utils/environment");
module.exports = new AzureIoTClient(AZURE_IOT_HUB_CONNECTION_STRING);
