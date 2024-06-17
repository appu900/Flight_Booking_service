const express = require("express");
const router = express.Router();

const BookingController = require("../../controllers/booking-controller");

router.post("/booking", BookingController.create);
router.get("/booking/:id", BookingController.get);
router.get("/booking/user/:id", BookingController.getByUserId);
router.post("/booking/cancel",BookingController.cancelBooking)

module.exports = router;
