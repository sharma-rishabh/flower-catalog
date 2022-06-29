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

  #parseComment(name, comment) {
    const date = new Date();
    const dateTime = date.toLocaleString();
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
