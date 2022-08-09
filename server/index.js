    const express = require('express');
    const app = express();
    require("dotenv").config();
    const connection = require("../db-config.js");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const cors = require("cors");

//port set-up
    const port = process.env.PORT ?? 5000;

//db connection
    connection.connect((err) => {
        if (err) {
            console.error('error connecting' + err.stack);
        } else {
            console.log('connected to the database with threadId: ' + connection.threadId);
        }
    });

//middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());

//Routes
    app.get('/', (req, res) => {
    res.send('Successfully connected to the world surf journal backend')
    })

    app.post("/api/registration", (req, res) => {
        bcrypt
        .hash(req.body.password, 10)
        .then((hashedPassword) => {
            let newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hashedPassword,
            };
            // console.log(newUser);
            // console.log(newUser.password);
            connection.query('INSERT INTO users SET ?', newUser, (err) => {
                if(err) {
                    res
                    .status(500)
                    .send('Server error, could not register the new user into the DB');
                } else {
                    res.status(201).send("Success registering the user!")
                }
            });
        })
        .catch((hashError) => 
        console.error(`There was an error encrypting the password. Error: ${hashError}`));
    });

    app.post('/api/log-in', (req, res) => {
        let user = {
            email: req.body.email,
            password: req.body.password,
        }
        connection.query(
            "SELECT * FROM users WHERE email = ?", user.email,
            (err, results) => {
            if (err) {
                res.status(500).send("Email not found");
                console.log("Email not found");
            } else {
                bcrypt
                .compare(user.password, results[0].password)
                .then((isAMatch) => {
                    if (isAMatch) {
                const generatedToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET
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

    app.post('/api/trip/log', (req, res) => {
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
            users_id: req.body.users_id
        }
        // console.log(tripLog);
        connection.query('INSERT INTO trip_log SET ?', tripLog, (err) => {
            if(err) {
                console.log("There was an error adding the trip to the DB");
                res.status(500).send('There was a server error when adding the trip')
            } else {
                res.status(200).send('The trip was added successfully');
                console.log("The trip was added successfully");
            }
        });
    });

    app.get('/api/trips/:id', (req, res) => {
        id = req.params.id;
        // console.log(id);
        connection.query('SELECT * FROM trip_log WHERE users_id = ?', id, (err, result) => {
            if (err) {
                res.status(400).send("There was a problem getting trip data");
                // console.log("BE problem")
            } else if (res.length === 0) {
                res.status(404).send("User has no trips");
                // console.log("not found")
            } else {
                res.json(result);
            }
        })
    })

    app.put('/api/trip/log/update', (req, res) => {
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
        }
        // console.log(tripUpdate);
        connection.query('UPDATE trip_log SET ? WHERE trip_log.id = ? AND trip_log.users_id = ?', [tripUpdate, tripId, userId], (err) => {
            if(err) {
                console.log("There was an error updating the trip in DB");
                res.status(500).send('There was a server error when updating the trip')
            } else {
                res.status(200).send('The trip was updated successfully');
                console.log("The trip was updated successfully");
            }
        });
    });

    app.listen(port, (err) => {
        if (err) {
            console.error('There was a problem with the server connection');
        } else {
            console.log(`Server is running on port ${port}`);
        }
    });