const bcrypt = require("bcrypt");
const pool = require("../util/database");
const jwt = require("jsonwebtoken");

exports.postUserRegistration = (req, res, next) => {
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
};

exports.postUserLogin = (req, res, next) => {
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
          .catch((err) =>
            console.error("Error trying to decrypt the password", err)
          );
      }
    }
  );
};
