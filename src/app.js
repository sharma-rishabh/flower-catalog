const express = require('express');

const { createRouter } = require('./server/router.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { guestBookRouter, guestBookHandler, addComment } = require('./handlers/guestBookHandler.js');
const { Comments } = require('./comments.js');
const { logRequest } = require('./handlers/logRequest.js');
const { addTimeStamp } = require('./handlers/addTimeStamp.js');
const { apiRouter } = require('./handlers/apiHandler.js');

const readJSON = (fileName, reader) => {
  try {
    const content = reader(fileName, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return '';
  }
};

const createApp = (config, logger, fs) => {
  const commentsJSON = readJSON(config.commentsFile, fs.readFileSync) || [];
  const comments = new Comments(commentsJSON);

  const flowers = [
    { name: 'abeliophyllum' },
    { name: 'agerantum' }
  ];
  const app = express();
  app.use(addTimeStamp);
  app.use(logRequest(logger));
  app.use(express.static(config.dirName));
  app.get('/guest-book', guestBookHandler(comments, fs));
  app.use(express.urlencoded({ extended: true }))
  app.post('/add-comment', addComment(comments, config.commentsFile, fs));
  return app;
}



// const app = ({ dirName, commentsFile }, fs = require('fs')) => {


//   const router = createRouter([
//     guestBookRouter(comments, fs.readFileSync, fs.writeFileSync, commentsFile),
// app.get(apiRouter(comments, flowers));
//     notFoundHandler
//   ]);
//   return router
// }

module.exports = { createApp };
