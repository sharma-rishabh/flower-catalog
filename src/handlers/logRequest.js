const logRequest = (request, response) => {
  console.log(request.timeStamp.toLocaleString(),
    request.method, request.url.pathname);
  return false;
};

module.exports = { logRequest };
