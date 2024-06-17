const { StatusCodes } = require("http-status-codes");
const BookingService = require("../services/booking-service");

const bookingService = new BookingService();

const create = async (req, res) => {
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
};

const get = async (req, res) => {
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
};

const getByUserId = async (req, res) => {
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
};

const cancelBooking = async (req, res) => {
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
};

module.exports = { create, get, getByUserId,cancelBooking };
