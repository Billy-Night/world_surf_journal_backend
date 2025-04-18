const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post("/api/registration", userController.postUserRegistration);
router.post("/api/log-in", userController.postUserLogin);

module.exports = router;
