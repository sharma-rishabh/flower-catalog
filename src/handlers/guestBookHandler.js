const { addHead, commentsToHTML } = require('../htmlGenerator.js');

const getHTMLPage = (comments, reader) => {
  const form = reader('./src/commentForm.html', 'utf-8')
  return addHead(form, commentsToHTML(comments));
}

const writeJSON = (fileName, content, writer) => {
  writer(fileName, content, 'utf-8');
};

const addComment = (comments, path, fs) => (request, response) => {
  const name = request.body.name;
  const comment = request.body.comment;

  if (name && comment) {
    comments.addComment(name, comment, request.timeStamp);
    writeJSON(path, comments.toJSON(), fs.writeFileSync);
  }

  response.redirect('/guest-book');
  return;
};

const guestBookHandler = (comments, fs) => (request, response) => {
  const finalPage = getHTMLPage(comments.comments, fs.readFileSync);
  response.type('.html');
  response.end(finalPage);
  return;
};

module.exports = { guestBookHandler, addComment };
