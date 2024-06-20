const express = require("express");
const router = express.Router();

const BookingController = require("../../controllers/booking-controller");
// const { createChannel } = require("../../utils/message-queue");

// const channel = await createChannel();
const bookingController = new BookingController();


router.post("/booking", bookingController.create);
router.get("/booking/:id", bookingController.get);
router.get("/booking/user/:id", bookingController.getByUserId);
router.post("/booking/cancel", bookingController.cancelBooking);

router.post("/publish",bookingController.sendMessages)


module.exports = router;
