const getCurrentTime = () => {
    // Get the current date and time in UTC
    var now = new Date();
  
    // Calculate the offset for IST (UTC+5:30)
    var istOffset = 5.5 * 60 * 60 * 1000;
  
    // Get UTC time in milliseconds
    var utcTime = now.getTime();
  
    // Adjust UTC time to IST
    var istTime = new Date(utcTime + istOffset);
  
    // Format the IST time to a string in ISO format
    var istDateTimeString = istTime.toISOString();
  
    return istDateTimeString;
  };
  
  
  module.exports = {
      getCurrentTime
  }