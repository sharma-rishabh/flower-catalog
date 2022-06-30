const { addHead, commentsToHTML } = require('../htmlGenerator.js');

const getHTMLPage = (comments, reader) => {
  const form = reader('./src/commentForm.html', 'utf-8')
  return addHead(form, commentsToHTML(comments));
}

const writeJSON = (fileName, content, writer) => {
  writer(fileName, JSON.stringify(content), 'utf-8');
};

const addCommentHandler = (request, response) => {
  const name = request.url.searchParams.get('name');
  const comment = request.url.searchParams.get('comment');

  if (name && comment) {
    request.comments.addComment(name, comment, request.timeStamp);
    writeJSON(request.file, request.comments.toJSON(), request.writer);
  }

  response.statusCode = 302;
  response.setHeader('location', '/guest-book')
  response.end('');
  return;
};

const guestBookHandler = (request, response) => {
  const finalPage = getHTMLPage(request.comments.comments, request.reader);
  response.setHeader('content-type', 'text/html');
  response.end(finalPage);
  return;
};

const guestBookRouter = (comments, reader, writer, file) =>
  (request, response) => {
    const uri = request.url.pathname;
    if (uri === '/guest-book' && request.method === 'GET') {
      request.comments = comments;
      request.reader = reader;
      guestBookHandler(request, response);
      return true;
    }
    if (uri === '/add-comment' && request.method === 'GET') {
      request.comments = comments;
      request.writer = writer;
      request.file = file;
      addCommentHandler(request, response);
      return true;
    }
    return false;
  };

module.exports = { guestBookRouter };
