class Comments {
  #comments;
  constructor(comments) {
    this.#comments = comments;
  }

  #parseComment(name, comment, timeStamp) {
    const dateTime = timeStamp.toLocaleString();
    return { name, comment, dateTime };
  }

  addComment(name, comment, timeStamp) {
    this.#comments.push(this.#parseComment(name, comment, timeStamp));
  }

  get comments() {
    return this.#comments;
  }

  toJSON() {
    return JSON.stringify(this.#comments);
  }
}

module.exports = { Comments };
