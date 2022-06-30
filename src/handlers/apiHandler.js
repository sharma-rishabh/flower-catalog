const guestApiHandler = (request, response) => {
  response.setHeader('content-type', 'application/json');
  response.end(request.guestBook.toJSON());
  return true;
};

const flowerApiHandler = (request, response) => {
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(request.flowers));
  return true;
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

module.exports = { apiRouter };
