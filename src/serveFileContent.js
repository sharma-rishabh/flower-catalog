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


const serveFileContent = (dirName) => {
  if (!fs.existsSync(dirName)) {
    throw new Error(`${dirName} does not exists.`)
  }
  return (request, response) => {
    let { uri } = request;

    if (uri === '/') {
      uri = '/index.html';
    }

    const fileName = `${dirName}${uri}`;
    console.log(fileName);
    let content;

    try {
      content = fs.readFileSync(fileName);
    } catch (error) {
      return false;
    }

    const type = mimeTypes(fileName) || 'text/plain';
    response.setHeaders('content-type', type);
    response.send(content);
    return true;
  }
}

module.exports = { serveFileContent };
