const fs = require('fs');
const { addHead, commentsToHTML } = require('../htmlGenerator.js');

const getHTMLPage = (comments) => {
  const form = fs.readFileSync('./src/commentForm.html', 'utf-8')
  return addHead(form, commentsToHTML(comments));
}

const addCommentHandler = (request, response) => {
  const name = request.url.searchParams.get('name');
  const comment = request.url.searchParams.get('comment');

  if (name && comment) {
    request.comments.addComment(name, comment);
  }

  response.statusCode = 302;
  response.setHeader('location', '/guest-book')
  response.end('');
  return;
};

const guestBookHandler = (request, response) => {
  const finalPage = getHTMLPage(request.comments.comments);
  response.setHeader('content-type', 'text/html');
  response.end(finalPage);
  return;
};

const guestBookRouter = (comments) => (request, response) => {
  const uri = request.url.pathname;
  if (uri === '/guest-book' && request.method === 'GET') {
    request.comments = comments;
    guestBookHandler(request, response);
    return true;
  }
  if (uri === '/add-comment' && request.method === 'GET') {
    request.comments = comments;
    addCommentHandler(request, response);
    return true;
  }
  return false;
};

module.exports = { guestBookRouter };
