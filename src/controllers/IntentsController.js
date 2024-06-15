const IntentsService = require("../services/IntentsService");

async function processInputs(input) {
  const intent = input.intent;

  switch (intent) {
    case "action.devices.SYNC":
      return IntentsService.sync(input);
    case "action.devices.QUERY":
      return IntentsService.query(input);
    case "action.devices.EXECUTE":
      return IntentsService.execute(input);
  }
}

async function create(req, res) {
  const requestId = req.body.requestId;
  const input = req.body.inputs[0];
  const payloadResponse = await processInputs(input);

  return res.json({
    requestId: requestId,
    payload: payloadResponse,
  });
}

module.exports = { create };
