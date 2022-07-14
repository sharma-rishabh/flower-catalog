const addTimeStamp = (request, response, next) => {
  request.timeStamp = new Date();
  next();
};

module.exports = { addTimeStamp }
