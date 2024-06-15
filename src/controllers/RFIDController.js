const zod = require("zod");
const TelemetryService = require("../services/TelemetryService");

const RFID = zod.object({
  id: zod.string(),
});

async function create(req, res) {
  try {
    const { body } = req;
    const rfid = RFID.parse(body);
    await TelemetryService.openDoorTemporarily();
    res.status(200).json(rfid);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
}

module.exports = {
  create,
};
