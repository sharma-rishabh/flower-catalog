const { createRouter } = require('./server/router.js');
const { createServeStatic } = require('./handlers/serveFileContent.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { guestBookRouter } = require('./handlers/guestBookHandler.js');
const { Comments } = require('./comments.js');
const { logRequest } = require('./handlers/logRequest.js');
const { addTimeStamp } = require('./handlers/addTimeStamp.js');
const { apiRouter } = require('./handlers/apiHandler.js');
const { parseBodyParams } = require('./handlers/parseBodyParams.js')

const readJSON = (fileName, reader) => {
  let content;
  try {
    content = reader(fileName, 'utf8')
    return JSON.parse(content);
  } catch (error) {
    return '';
  }
};

const app = ({ dirName, commentsFile }, fs = require('fs')) => {
  const commentsJSON = readJSON(commentsFile, fs.readFileSync);
  const comments = new Comments(commentsJSON);

  const flowers = [
    { name: 'abeliophyllum' },
    { name: 'agerantum' }
  ];

  const router = createRouter([
    addTimeStamp,
    logRequest,
    parseBodyParams,
    createServeStatic(dirName),
    guestBookRouter(comments, fs.readFileSync, fs.writeFileSync, commentsFile),
    apiRouter(comments, flowers),
    notFoundHandler
  ]);
  return router
}

module.exports = { app };
