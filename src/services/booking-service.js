const { StatusCodes } = require("http-status-codes");
const { FLIGHT_SERVICE_PATH } = require("../config/server-config");
const { BookingRepository } = require("../repository/index");
const { ServiceError } = require("../utils/Errors");
const { createChannel, publishMessage } = require("../utils/message-queue")
const { REMINDER_SERVICE_BINDING_KEY } = require("../config/server-config")
const { getCurrentTime } = require("../utils/helper");

const axios = require("axios");
// const { createChannel } = require("../utils/message-queue");


class BookingService {
  channal;
  constructor() {
    this.bookingRepo = new BookingRepository();
  }


  async createChannalOnce(){
     if(!this.channal){
        this.channal = await createChannel();
     }
     return this.channal;
  }


  async sendNotification(){
    try {
        const channel = await createChannel()
        const currentTime = getCurrentTime();
        const payload = {
          data:{
            subject:"Booking Notification",
            content:"Booking sucessfully done",
            recepientEmail:"appudq670@gmail.com",
            notificationTime: currentTime,
          },
          service:"CREATE_TICKET"
        }

        await publishMessage(
          channel,
          REMINDER_SERVICE_BINDING_KEY,
          JSON.stringify(payload)
        )
    } catch (error) {
       console.log(error);
    }
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

      await this.sendNotification();



      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }

  async cancelBooking(bookingId) {
    try {
      /**
       * first get the booking details
       *
       * update the flight model
       * delete the booking
       *
       */

      const booking = await this.bookingRepo.get(bookingId);

      let getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      let updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;

      const flightResponse = await axios.get(getFlightRequestUrl);
      const flightData = flightResponse.data.data;
      
      //    ** update the no of seats

      const updatedRes = await axios.patch(updateFlightRequestURL, {
        totalSeats: flightData.totalSeats + booking.noOfSeats,
      });

      //   ** update the status to cancelled in booking table

      const response = await this.bookingRepo.update(booking.id, {
        status: "Cancelled",
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getBookingDetails(bookingId) {
    try {
      const response = await this.bookingRepo.get(bookingId);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getBookingByUserId(userId) {
    try {
      const response = await this.bookingRepo.getByUserId(userId);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookingService;
