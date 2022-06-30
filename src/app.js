const { createRouter } = require('./server/router.js');
const { createServeStatic } = require('./handlers/serveFileContent.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { guestBookRouter } = require('./handlers/guestBookHandler.js');
const { Comments } = require('./comments.js');
const { logRequest } = require('./handlers/logRequest.js');
const { addTimeStamp } = require('./handlers/addTimeStamp.js');
const { apiRouter } = require('./handlers/apiHandler.js');

const app = ({ dirName, commentsFile }) => {
  const comments = new Comments(commentsFile);
  comments.loadComments();

  const flowers = [
    { name: 'abeliophyllum' },
    { name: 'agerantum' }
  ];

  const router = createRouter([
    addTimeStamp,
    logRequest,
    createServeStatic(dirName),
    guestBookRouter(comments),
    apiRouter(comments, flowers),
    notFoundHandler]
  );
  return router
}

module.exports = { app };
