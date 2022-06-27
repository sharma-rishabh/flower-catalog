const html = (body) => `<h1>${body}</h1>`;

const notFoundHandler = (_, response) => {
  response.statusCode = 404;
  response.setHeaders('Content-Type', 'text/html');
  response.send(html('Sorry!! We couldn\'t find the page you\'re looking for'));
  return true;
};

module.exports = { notFoundHandler };
