const express = require('express')
const app = express()
const port = 3306

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