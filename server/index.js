const express = require('express')
const app = express()
require("dotenv").config();
const connection = require("../db-config.js");

const port = process.env.PORT ?? 5000;

connection.connect((err) => {
    if (err) {
        console.error('error connecting' + err.stack);
    } else {
        console.log('connected to the database with threadId: ' + connection.threadId);
    }
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, (err) => {
    if (err) {
        console.error('There was a problem with the server connection');
    } else {
        console.log(`Server is running on port ${port}`);
    }
});