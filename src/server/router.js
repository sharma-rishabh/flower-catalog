const createRouter = (handlers) => (response, request) => {
  for (const handler of handlers) {
    if (handler(response, request)) {
      return true;
    }
  }
};

module.exports = { createRouter };
