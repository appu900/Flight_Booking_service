const { StatusCodes } = require("http-status-codes");
const { FLIGHT_SERVICE_PATH } = require("../config/server-config");
const { BookingRepository } = require("../repository/index");
const { ServiceError } = require("../utils/Errors");

const axios = require("axios");

class BookingService {
  constructor() {
    this.bookingRepo = new BookingRepository();
  }

  async createBooking(data) {
    try {
      // ** fetch the data from microservices communication
      const flightId = data.flightId;
      let getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const response = await axios.get(getFlightRequestUrl);

      const flightData = response.data.data;
      const priceOfTheFlight = flightData.price;

      //   ** check if the no of requested seats are avalabil or not

      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "seats are not available",
          "insufficiant seats can not processd booking process"
        );
      }

      //   ** calculate the total cost for the booking process

      const totalCost = priceOfTheFlight * data.noOfSeats;
      const bookingPayload = { ...data, totalCost };

      //   ** making booking
      const booking = await this.bookingRepo.create(bookingPayload);

      //   ** update flight details for seat avaaboility
      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      await axios.patch(updateFlightRequestURL, {
        totalSeats: flightData.totalSeats - booking.noOfSeats,
      });

      //   ** update the status of booing processing to Booked
      const finalBooking = await this.bookingRepo.update(booking.id, {
        status: "Booked",
      });

      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
