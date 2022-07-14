const guestApiHandler = (comment) => (request, response) => {
  response.json(comment.toJSON());
};

const flowerApiHandler = (flowers) => (request, response) => {
  response.json(JSON.stringify(flowers));
};

const apiRouter = (guestBook, flowers) => (request, response) => {
  const uri = request.url.pathname;
  if (uri === '/api/guest-book') {
    request.guestBook = guestBook;
    guestApiHandler(request, response);
    return true;
  }
  if (uri === '/api/flowers') {
    request.flowers = flowers;
    flowerApiHandler(request, response);
    return true;
  }
  return false;
};

module.exports = { flowerApiHandler, guestApiHandler };
