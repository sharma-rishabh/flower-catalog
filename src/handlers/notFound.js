const html = (body) => `<h1>${body}</h1>`;

const notFoundHandler = (_, response) => {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/html');
  response.end(html('Sorry!! We couldn\'t find the page you\'re looking for'));
  return true;
};

module.exports = { notFoundHandler };
