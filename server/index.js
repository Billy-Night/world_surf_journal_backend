const express = require('express')
const app = express()
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

app.post("/registration", (req, res) => {
    bcrypt
     .hash(req.body.password, 10)
     .then((hashedPassword) => {
        let newUser = {
            email: req.body.email,
            password: hashedPassword,
        };
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

app.listen(port, (err) => {
    if (err) {
        console.error('There was a problem with the server connection');
    } else {
        console.log(`Server is running on port ${port}`);
    }
});