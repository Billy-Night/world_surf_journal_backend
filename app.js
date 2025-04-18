const express = require("express");
const app = express();
require("dotenv").config();
const pool = require("./util/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = process.env.PORT ?? 5000;

const corsOptions = {
  origin: `${process.env.ORIGIN}${port}`,
  credential: true,
};

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

//Routes
app.get("/", (req, res) => {
  res.send(`Successfully connected to the world surf journal backend`);
});

app.post("/api/registration", (req, res) => {
  if (typeof req.body.password !== "string") {
    return res
      .status(400)
      .send("Password must be provided and must be a string");
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      let newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
      };
      pool.query("INSERT INTO users SET ?", newUser, (err) => {
        if (err) {
          res
            .status(500)
            .send("Server error, could not register the new user into the DB");
        } else {
          res.status(201).send("Success registering the user!");
        }
      });
    })
    .catch((err) =>
      console.error(`There was an error registering the user. Error: ${err}`)
    );
});

app.post("/api/log-in", (req, res) => {
  // console.log(req.body);
  let user = {
    email: req.body.email,
    password: req.body.password,
  };

  pool.query(
    "SELECT * FROM users WHERE email = ?",
    user.email,
    (err, results) => {
      if (results === undefined) {
        res.status(400).send("result is undefined");
        console.log(err);
      } else if (results.length === 0) {
        res.status(401).send("Email not found");
        console.log(err);
      } else {
        // console.log(results);
        bcrypt
          .compare(user.password, results[0].password)
          .then((isAMatch) => {
            if (isAMatch) {
              const generatedToken = jwt.sign(
                user,
                process.env.ACCESS_TOKEN_SECRET
              );
              res.status(200).json({
                message: "Successfully logged in!",
                token: generatedToken,
                loggedIn: true,
                id: results[0].id,
                first_name: results[0].first_name,
              });
            } else {
              res.status(500).send("Wrong password");
            }
          })
          .catch((passwordError) =>
            console.error("Error trying to decrypt the password")
          );
      }
    }
  );
});

app.post("/api/trip/log", (req, res) => {
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
  // console.log(tripLog);
  pool.query("INSERT INTO trip_log SET ?", tripLog, (err) => {
    if (err) {
      console.log("There was an error adding the trip to the DB");
      res.status(500).send("There was a server error when adding the trip");
    } else {
      res.status(200).send("The trip was added successfully");
      console.log("The trip was added successfully");
    }
  });
});

app.get("/api/trips/:id", (req, res) => {
  id = req.params.id;
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
});

app.put("/api/trip/log/update", (req, res) => {
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
});

app.delete("/api/trip/log/delete/:id", (req, res) => {
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
});

app.listen(port, (err) => {
  if (err) {
    console.error("There was a problem with the server connection");
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
