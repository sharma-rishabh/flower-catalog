const fs = require('fs');
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

  get comments() {
    return this.#comments;
  }

  toJSON() {
    return JSON.stringify(this.#comments);
  }
}

module.exports = { Comments };
