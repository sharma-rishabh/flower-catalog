const { app } = require('./src/app.js');
const { startServer } = require('./src/server/server.js');

const main = ([dirName, commentsFile]) => {
  startServer(9090, app(dirName, commentsFile));
};

main(process.argv.slice(2))
