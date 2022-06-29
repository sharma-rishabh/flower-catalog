const addTimeStamp = (request, response) => {
  request.timeStamp = new Date();
  return false;
};

module.exports = { addTimeStamp }
