const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { PORT, FLIGHT_SERVICE_PATH } = require("./config/server-config");
const apiRoutes = require("./routes/index");

const db = require("./models/index");


const setUpAndStartServer = async () => {
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRoutes);
  app.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT}`);

    // if (process.env.DB_SYNC) {
    //   db.sequelize.sync({ alter: true });
    // }

 
  });
};

setUpAndStartServer();
