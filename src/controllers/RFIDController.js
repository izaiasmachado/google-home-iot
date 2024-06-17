const zod = require("zod");
const TelemetryService = require("../services/TelemetryService");
const logger = require("../utils/logger");

const RFID = zod.object({
  id: zod.string(),
});

async function create(req, res) {
  try {
    const { body } = req;
    const rfid = RFID.parse(body);
    logger.info(`RFID card scanned: ${rfid.id}`);

    const userExists = getUserByRFID(rfid);

    if (!userExists) {
      return res.status(401).json({ error: "User not authorized" });
    }

    await TelemetryService.openDoorTemporarily();
    res.status(200).json({
      message: `User ${userExists.name} opened the door`,
      user: userExists,
    });
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
}

function getUserByRFID(rfidCard) {
  const { id } = rfidCard;
  const users = [
    {
      rfid: "23 1A 13 03",
      name: "Izaias Machado",
    },
    {
      rfid: "C3 A4 46 0E",
      name: "Marcos Vinicius",
    },
    {
      rfid: "F4 4C BD A4",
      name: "William Bruno",
    },
  ];

  return users.find((user) => user.rfid == id) || null;
}

module.exports = {
  create,
};
