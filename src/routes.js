const express = require("express");
const router = express.Router();

const AuthController = require("./controllers/AuthController");
const LoginController = require("./controllers/LoginController");
const TokenController = require("./controllers/TokenController");
const IntentsController = require("./controllers/IntentsController");
const RFIDController = require("./controllers/RFIDController");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/fakeauth", AuthController.redirectToLoginPage);
router.get("/login", LoginController.redirectToConsentPage);
router.post("/login", LoginController.redirectToConsentPage);
router.post("/faketoken", TokenController.create);
router.post("/smarthome", IntentsController.create);
router.post("/rfid", RFIDController.create);

module.exports = router;
