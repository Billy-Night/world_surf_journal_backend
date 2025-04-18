const pool = require("../util/database");

exports.postNewTrip = (req, res, next) => {
  let tripLog = {
    title: req.body.title,
    image: req.body.image,
    where: req.body.where,
    when: req.body.when,
    who: req.body.who,
    how: req.body.how,
    rating: req.body.rating,
    notes: req.body.notes,
    gear: req.body.gear,
    quiver: req.body.quiver,
    duration: req.body.duration,
    users_id: req.body.users_id,
  };
  pool.query("INSERT INTO trip_log SET ?", tripLog, (err) => {
    if (err) {
      console.log("There was an error adding the trip to the DB");
      res.status(500).send("There was a server error when adding the trip");
    } else {
      res.status(200).send("The trip was added successfully");
      console.log("The trip was added successfully");
    }
  });
};

exports.getTrips = (req, res, next) => {
  let id = req.params.id;
  // console.log(id);
  pool.query("SELECT * FROM trip_log WHERE users_id = ?", id, (err, result) => {
    if (err) {
      res.status(400).send("There was a problem getting trip data");
      // console.log("BE problem")
    } else if (res.length === 0) {
      res.status(404).send("User has no trips");
      // console.log("not found")
    } else {
      res.json(result);
    }
  });
};

exports.putEditTrip = (req, res, next) => {
  let userId = req.body.users_id;
  let tripId = req.body.id;
  let tripUpdate = {
    title: req.body.title,
    image: req.body.image,
    where: req.body.where,
    when: req.body.when,
    who: req.body.who,
    how: req.body.how,
    rating: req.body.rating,
    notes: req.body.notes,
    gear: req.body.gear,
    quiver: req.body.quiver,
    duration: req.body.duration,
  };
  // console.log(tripUpdate);
  pool.query(
    "UPDATE trip_log SET ? WHERE trip_log.id = ? AND trip_log.users_id = ?",
    [tripUpdate, tripId, userId],
    (err) => {
      if (err) {
        console.log("There was an error updating the trip in DB");
        res.status(500).send("There was a server error when updating the trip");
      } else {
        res.status(200).send("The trip was updated successfully");
        console.log("The trip was updated successfully");
      }
    }
  );
};

exports.deleteTrip = (req, res, next) => {
  let tripId = req.params.id;
  // console.log(id);
  pool.query("DELETE FROM trip_log WHERE trip_log.id = ?", [tripId], (err) => {
    if (err) {
      console.log("There was a problem with finding the trip in the backend");
      res
        .status(204)
        .send("There was a server error when trying to delete the trip");
    } else {
      res.status(200).send("The trip has been deleted successfully");
      console.log("The trip has been deleted");
    }
  });
};
