const { StatusCodes } = require("http-status-codes");
const BookingService = require("../services/booking-service");
const { createChannel, publishMessage } = require("../utils/message-queue");
const { REMINDER_SERVICE_BINDING_KEY } = require("../config/server-config");
const { getCurrentTime } = require("../utils/helper");

const bookingService = new BookingService();

class BookingController {
  constructor() {}

  async sendMessages(req, res) {
    const channel = await createChannel();
    const currentTime = getCurrentTime();
    const payload = {
      data: {
        subject: "Booking Reminder 4",
        content: "Your booking is about to expire in 24 hours",
        recepientEmail: "appudq670@gmail.com",
        notificationTime: currentTime,
      },
      service:"CREATE_TICKET"
    };
    await publishMessage(
      channel,
      REMINDER_SERVICE_BINDING_KEY,
      JSON.stringify(payload)
    );
    return res.status(200).json({
      message: "Succesfully published the Messsage",
    });
  }

  async create(req, res) {
    try {
      console.log(req.body);
      const response = await bookingService.createBooking(req.body);
      return res.status(StatusCodes.OK).json({
        success: true,
        data: response,
        message: "booking done sucessfully",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        message: "something went wrong",
      });
    }
  }

  async get(req, res) {
    try {
      const response = await bookingService.getBookingDetails(req.params.id);
      return res.status(StatusCodes.OK).json({
        success: true,
        data: response,
        message: "data fetched sucessfully",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        message: "something went wrong",
      });
    }
  }

  async getByUserId(req, res) {
    try {
      const response = await bookingService.getBookingByUserId(req.params.id);
      return res.status(StatusCodes.OK).json({
        success: true,
        data: response,
        message: "booking details fetched successfully",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        message: "something went wrong",
      });
    }
  }

  async cancelBooking(req, res) {
    try {
      const response = await bookingService.cancelBooking(req.body.bookingId);
      return res.status(StatusCodes.OK).json({
        success: true,
        data: response,
        message: "ticket cancelled successfully",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        message: "can not perform cancellation process",
      });
    }
  }
}

module.exports = BookingController;
