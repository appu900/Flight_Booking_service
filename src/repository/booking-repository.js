const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models/index");
const { ValidationError, AppError } = require("../utils/Errors/index");

class BookingRepository {
  //** create booking **/
  async create(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "RepositoryError",
        "Can not create Booking",
        "some issue creating a booking",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  //   ** update the data

  async update(bookingId, data) {
    try {
      const booking = await Booking.findByPk(bookingId);
      if (data.status) {
        booking.status = data.status;
      }
      await booking.save();
      return booking;
    } catch (error) {
      throw new AppError(
        "RepositoryError",
        "can not update Booking",
        "There is something issue occuring whike updating the data",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async destroy(bookingId) {
    try {
      const response = await Booking.destroy({
        where: {
          id: bookingId,
        },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const response = await Booking.findByPk(id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getByUserId(requestedUserId) {
    try {
      const response = await Booking.findAll({
        where: {
          userId: requestedUserId,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }


  
}

module.exports = BookingRepository;
