const dotEnv = require("dotenv");
dotEnv.config();

module.exports = {
  PORT: process.env.PORT,
  FLIGHT_SERVICE_PATH:process.env.FLIGHT_SERVICE_PATH
};
