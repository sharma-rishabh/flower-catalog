const fs = require('fs');

const mimeTypes = (fileName) => {
  const extension = fileName.slice(fileName.lastIndexOf('.') + 1);
  const types = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    html: 'text/html',
    pdf: 'text/pdf',
    '': 'text/plain'
  }
  return types[extension];
}


const createServeStatic = (dirName) => {
  if (!fs.existsSync(dirName)) {
    throw new Error(`${dirName} does not exists.`)
  }
  return (request, response) => {
    if (request.method !== 'GET') {
      return false;
    }

    let uri = request.url.pathname;

    if (uri === '/') {
      uri = '/index.html';
    }

    const fileName = dirName + uri;
    let content;
    try {
      content = fs.readFileSync(fileName);
    } catch (error) {
      return false;
    }

    const type = mimeTypes(fileName) || 'text/plain';
    response.setHeader('content-type', type);
    response.end(content);
    return true;
  }
}

module.exports = { createServeStatic };
