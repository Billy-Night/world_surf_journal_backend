const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post("/registration", userController.postUserRegistration);
router.post("/log-in", userController.postUserLogin);

module.exports = router;
