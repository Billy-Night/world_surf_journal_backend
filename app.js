const express = require("express");
const app = express();
require("dotenv").config();
const pool = require("./util/database");
const cors = require("cors");
const port = process.env.PORT ?? 5000;
const userRoutes = require("../world_surf_journal_backend/routes/users.js");
const tripsRoutes = require("../world_surf_journal_backend/routes/trips.js");

const corsOptions = {
  origin: `${process.env.ORIGIN}${port}`,
  credential: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.use(userRoutes);
app.use(tripsRoutes);

app.listen(port, (err) => {
  if (err) {
    console.error("There was a problem with the server connection");
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
