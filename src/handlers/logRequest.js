const logRequest = (logger) => (request, response, next) => {
  logger(request.method, request.url, request.timeStamp.toLocaleString());
  next();
};

module.exports = { logRequest };
