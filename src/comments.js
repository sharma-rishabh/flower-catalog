const fs = require('fs');
const {
  createCommentDiv, createTimeStampDiv, createNameDiv, generateTag
} = require('./htmlGenerator.js');

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

const parseSpecialCharacters = (string) => {
  let parsedString = string.replaceAll(/\+/g, ' ');
  parsedString = parsedString.replaceAll(/%0D/g, '\n');
  parsedString = parsedString.replaceAll(/%0A/g, '\r');
  return parsedString;
}

class Comments {
  #location;
  #comments;
  constructor(location) {
    this.#location = location;
    this.#comments;
  }

  loadComments() {
    this.#comments = readJSON(this.#location) || [];
  }

  #parseComment(rawName, rawComment) {
    const date = new Date();
    const dateTime = date.toLocaleString();
    const name = parseSpecialCharacters(rawName);
    const comment = parseSpecialCharacters(rawComment);
    return { name, comment, dateTime };
  }

  addComment(name, comment) {
    this.#comments.push(this.#parseComment(name, comment));
    writeJSON(this.#location, this.#comments);
  }

  toHTML() {
    const commentsDiv = [];

    for (let index = this.#comments.length - 1; index >= 0; index--) {
      const { name, comment, dateTime } = this.#comments[index];
      const nameDiv = createNameDiv(name);
      const timeStamp = createTimeStampDiv(dateTime);
      const commentDiv = createCommentDiv(comment);
      commentsDiv.push(generateTag('div', nameDiv + timeStamp + commentDiv));
    }
    return commentsDiv.join('');
  }
}

module.exports = { Comments };
