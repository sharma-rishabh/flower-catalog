const http = require('http');
const { URL } = require('url');

const startServer = (port, router) => {
  const server = http.createServer((req, res) => {
    req.url = new URL(req.url, 'http://' + req.headers.host);
    router(req, res);
  })

  server.listen(port, () => console.log('Listening on ' + port));
};

module.exports = { startServer };
