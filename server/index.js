const express = require('express')
const app = express()
require("dotenv").config();

const port = process.env.PORT ?? 5000;

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