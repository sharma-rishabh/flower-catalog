const guestApiHandler = (comment) => (request, response) => {
  response.json(comment.toJSON());
};

const flowerApiHandler = (flowers) => (request, response) => {
  response.json(JSON.stringify(flowers));
};

module.exports = { flowerApiHandler, guestApiHandler };
