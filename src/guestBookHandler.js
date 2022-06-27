const fs = require('fs');
const { commentsToHTML, addHead } = require('./htmlGenerator.js');

const parseSpecialCharacters = (string) => {
  let parsedString = string.replaceAll(/\+/g, ' ');
  parsedString = parsedString.replaceAll(/%0D/g, '\n');
  parsedString = parsedString.replaceAll(/%0A/g, '\r');
  return parsedString;
}

const parseComment = (rawName, rawComment) => {
  const date = new Date();
  const dateTime = date.toLocaleString();

  const name = parseSpecialCharacters(rawName);
  const comment = parseSpecialCharacters(rawComment);

  return { name, comment, dateTime };
};

const readJSON = (fileName) => {
  let content;
  try {
    content = fs.readFileSync(fileName, 'utf8')
    return JSON.parse(content);
  } catch (error) {
    return '';
  }
};

const writeJSON = (fileName, content) => {
  fs.writeFileSync(fileName, JSON.stringify(content), 'utf-8');
};

const guestBook = (request, response) => {
  let comments = readJSON('./data/comments.json') || [];
  const { name, comment } = request.queryParams;
  if (name && comment) {
    const commentObj = parseComment(name, comment);
    comments.push(commentObj);
    writeJSON('./data/comments.json', comments);
  }
  const form = fs.readFileSync('./src/commentForm.html', 'utf-8')
  comments = readJSON('./data/comments.json') || [];
  const commentsHTML = commentsToHTML(comments);
  const finalPage = addHead(form, commentsHTML);
  response.setHeaders('content-type', 'text/html');
  response.send(finalPage);
  return;
};

const guestBookHandler = (request, response) => {
  const { uri } = request;
  if (uri === '/guest-book') {
    guestBook(request, response);
    return true;
  }
  return false;
};

module.exports = { guestBookHandler };
