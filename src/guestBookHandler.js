const fs = require('fs');
const { addHead } = require('./htmlGenerator.js');

const getHTMLPage = (comments) => {
  const form = fs.readFileSync('./src/commentForm.html', 'utf-8')
  return addHead(form, comments.toHTML());
}

const guestBook = (request, response, comments) => {
  const { name, comment } = request.queryParams;

  if (name && comment) {
    comments.addComment(name, comment);
    response.statusCode = 302;
    response.setHeaders('location', '/guest-book')
    response.send('');
    return;
  }
  const finalPage = getHTMLPage(comments);
  response.setHeaders('content-type', 'text/html');
  response.send(finalPage);
  return;
};

const guestBookHandler = (comments) => (request, response) => {
  const { uri } = request;
  if (uri === '/guest-book') {
    guestBook(request, response, comments);
    return true;
  }
  return false;
};

module.exports = { guestBookHandler };
