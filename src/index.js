const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {PORT} = require("./config/server-config")

const setUpAndStartServer = async () => {
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setUpAndStartServer();
