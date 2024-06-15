require("dotenv").config();

const zod = require("zod");

const envSchema = zod.object({
  ENVIROMENT: zod.string().default("development"),
  LOG_LEVEL: zod.string().default("info"),
  AZURE_IOT_HUB_CONNECTION_STRING: zod.string(),
});

module.exports = envSchema.parse(process.env);
