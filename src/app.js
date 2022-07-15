const express = require('express');

const { notFoundHandler } = require('./handlers/notFound.js');
const { guestBookHandler, addComment } = require('./handlers/guestBookHandler.js');
const { Comments } = require('./comments.js');
const { logRequest } = require('./handlers/logRequest.js');
const { addTimeStamp } = require('./handlers/addTimeStamp.js');
const { flowerApiHandler, guestApiHandler } = require('./handlers/apiHandler.js');
const { parseCookies } = require('./handlers/parseCookies.js');
const { createInjectSession } = require('./createInjectSession.js');

const readJSON = (fileName, reader) => {
  try {
    const content = reader(fileName, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return '';
  }
};

const isConfigValid = (config) => {
  return config.commentsFile && config.flowerData && config.dirName;
}

const createApp = (config, sessions, logger, fs) => {
  if (!isConfigValid(config)) {
    throw new Error('Config is not provided properly.');
  }

  const commentsJSON = readJSON(config.commentsFile, fs.readFileSync) || [];
  const comments = new Comments(commentsJSON);
  const flowers = readJSON(config.flowerData, fs.readFileSync);

  const app = express();
  app.use(addTimeStamp);
  app.use(logRequest(logger));
  app.use(parseCookies);
  app.use(createInjectSession(sessions));
  app.use(express.static(config.dirName));
  app.get('/guest-book', guestBookHandler(comments, fs));
  app.use(express.urlencoded({ extended: true }))
  app.post('/add-comment', addComment(comments, config.commentsFile, fs));

  const apiRouter = express.Router();
  app.use('/api', apiRouter)
  apiRouter.get('/flowers', flowerApiHandler(flowers));
  apiRouter.get('/guest-book', guestApiHandler(comments));

  app.use(notFoundHandler);
  return app;
}

module.exports = { createApp };
