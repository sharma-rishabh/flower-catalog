const { createServer } = require('net');
const { parseRequest } = require('./src/parseRequest.js');
const { serveFileContent } = require('./src/serveFileContent.js');
const { Response } = require('./src/response.js');
const { notFoundHandler } = require('./src/notFound.js');
const { guestBookHandler } = require('./src/guestBookHandler.js');

const createHandler = (handlers) => (response, request) => {
  for (const handler of handlers) {
    if (handler(response, request)) {
      return true;
    }
  }
};

const startServer = (port, handler) => {
  const server = createServer((socket) => {
    const response = new Response(socket);

    socket.on('data', data => {
      const request = parseRequest(data.toString());
      console.log(request.method, request.uri);
      handler(request, response);
    });

    socket.on('error', (error) => { console.log(`couldn't find resource`); })
  });

  server.listen(port, () => console.log('listening on port: 5555'));
};

const main = (dirName) => {

  const handlers = [
    serveFileContent(dirName),
    guestBookHandler,
    notFoundHandler
  ];

  startServer(5555, createHandler(handlers));
};

main(process.argv[2]);