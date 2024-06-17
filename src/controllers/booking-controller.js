const { StatusCodes } = require("http-status-codes");
const BookingService = require("../services/booking-service");

const bookingService = new BookingService();

const create = async (req, res) => {
  try {
    console.log(req.body)
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

module.exports = {create};
   