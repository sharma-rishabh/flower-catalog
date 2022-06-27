const parseUri = (rawUri) => {
  const queryParams = {};
  const [uri, rawQuery] = rawUri.split('?');
  if (rawQuery) {
    const queries = rawQuery.split('&');
    queries.forEach((query) => {
      const [param, value] = query.split('=');
      queryParams[param] = value;
    });
  }
  return { uri, queryParams }
};

const parseRequestLine = (line) => {
  const [method, rawUri, httpVersion] = line.split(' ');
  return { ...parseUri(rawUri), method, httpVersion };
};

const parseHeader = (line) => {
  const indexOfSeparator = line.indexOf(':');
  const header = line.slice(0, indexOfSeparator).trim();
  const value = line.slice(indexOfSeparator + 1).trim();

  return [header.toLowerCase(), value];
};

const parseHeaders = (lines) => {
  const headers = {};
  let index = 0;
  while (index < lines.length && lines[index]) {
    const [header, value] = parseHeader(lines[index]);
    headers[header] = value;
    index++;
  }

  return headers;
}

const parseRequest = (request) => {
  const lines = request.split('\r\n');
  const requestLine = parseRequestLine(lines[0]);
  const headers = parseHeaders(lines.slice(1));

  return { ...requestLine, headers };
};

module.exports = { parseRequestLine, parseHeader, parseHeaders, parseRequest };
