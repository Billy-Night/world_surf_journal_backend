const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const userRoutes = require("./routes/users.js");
const tripsRoutes = require("./routes/trips.js");

const corsOptions = {
  origin: process.env.ORIGIN_RAIL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", userRoutes);
app.use(tripsRoutes);

app.listen(port, (err) => {
  if (err) {
    console.error("There was a problem with the server connection");
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
