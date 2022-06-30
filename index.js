const { app } = require('./src/app.js');
const { startServer } = require('./src/server/server.js');

const main = () => {
  const { dirName, commentsFile } = process.env;
  startServer(9090, app({ dirName, commentsFile }));
};

main()
