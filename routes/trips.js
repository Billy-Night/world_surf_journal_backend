const express = require("express");
const router = express.Router();
const tripsController = require("../controllers/trips");

router.post("/api/trip/log", tripsController.postNewTrip);
router.get("/api/trips/:id", tripsController.getTrips);
router.put("/api/trip/log/update", tripsController.putEditTrip);
router.delete("/api/trip/log/delete/:id", tripsController.deleteTrip);

module.exports = router;
