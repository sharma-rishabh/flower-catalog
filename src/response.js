const EOL = '\r\n';
const statusMessage = {
  200: 'OK',
  404: 'NOT FOUND'
};

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  equal(anotherResponse) {
    return anotherResponse instanceof Response &&
      this.#statusCode === anotherResponse.#statusCode;
  }

  setHeaders(header, value) {
    this.#headers[header] = value;
  }

  #sendHeaders() {
    Object.entries(this.#headers).forEach(([header, value]) => {
      this.#write(`${header}:${value}${EOL}`);
    });
  }

  #responseLine() {
    const httpVersion = 'HTTP/1.1';
    return [
      httpVersion,
      this.#statusCode,
      statusMessage[this.#statusCode]
    ].join(' ') + EOL;
  }

  set statusCode(newStatusCode) {
    this.#statusCode = newStatusCode;
  }

  #write(content) {
    this.#socket.write(content);
  }

  #end() {
    this.#socket.end();
  }

  send(body) {
    this.setHeaders('Content-Length', body.length);
    this.#write(this.#responseLine());
    this.#sendHeaders();
    this.#write(EOL);
    this.#write(body);
    this.#end()
  }
}

module.exports = { Response };
