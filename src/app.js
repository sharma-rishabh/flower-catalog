const { createRouter } = require('./server/router.js');
const { createServeStatic } = require('./handlers/serveFileContent.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { Comments } = require('./comments.js');
const { logRequest } = require('./handlers/logRequest.js');
const { addTimeStamp } = require('./handlers/addTimeStamp.js');

const app = (dirName, commentFile) => {
  const comments = new Comments(commentFile);
  comments.loadComments();

  const router = createRouter([
    addTimeStamp,
    logRequest,
    createServeStatic(dirName),
    guestBookHandler(comments),
    notFoundHandler]
  );
  return router
}

module.exports = { app };
