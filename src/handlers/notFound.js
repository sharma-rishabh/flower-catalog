const html = (body) => `<h1>${body}</h1>`;

const notFoundHandler = (_, response) => {
  response.status(404);
  response.type('html');
  response.end(html('Sorry!! We couldn\'t find the page you\'re looking for'));
};

module.exports = { notFoundHandler };
