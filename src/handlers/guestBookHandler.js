const fs = require('fs');
const { addHead } = require('../htmlGenerator.js');

const getHTMLPage = (comments) => {
  const form = fs.readFileSync('./src/commentForm.html', 'utf-8')
  return addHead(form, comments.toHTML());
}

const guestBook = (request, response) => {
  const name = request.url.searchParams.get('name');
  const comment = request.url.searchParams.get('comment');

  if (name && comment) {
    request.comments.addComment(name, comment);
    response.statusCode = 302;
    response.setHeader('location', '/guest-book')
    response.end('');
    return;
  }
  const finalPage = getHTMLPage(request.comments);
  response.setHeader('content-type', 'text/html');
  response.end(finalPage);
  return;
};

const guestBookHandler = (comments) => (request, response) => {
  const uri = request.url.pathname;
  if (uri === '/guest-book' && request.method === 'GET') {
    request.comments = comments;
    guestBook(request, response);
    return true;
  }
  return false;
};

module.exports = { guestBookHandler };
