const openingTag = (tagName, attributes) => {
  return `<${tagName} ${attributes}>`;
};

const closingTag = (tagName) => `</${tagName}>`;

const createAttributes = (attributes) => {
  const entries = Object.entries(attributes);
  return entries.reduce((stringifiedAttributes, [attr, value]) => {
    return `${stringifiedAttributes} ${attr}="${value}"`;
  }, '')
};

const generateTag = (tagName, content, attributes = '') => {
  return openingTag(tagName, attributes) + content + closingTag(tagName);
};

const generateHead = () => {
  const attributes = createAttributes({
    rel: 'stylesheet', href: 'css/styles.css'
  });
  const link = openingTag('link', attributes)
  const title = generateTag('title', 'Guest Book');
  return generateTag('head', title + link);
}

const commentsToHTML = (comments) => {
  const commentsDiv = comments.map(
    ({ name, comment, dateTime }) => {
      const nameDiv = generateTag('div', name, createAttributes({ class: 'name' }));
      const timeStamp = generateTag('div', dateTime, createAttributes({ class: 'time-stamp' }));
      const commentDiv = generateTag('p', comment, createAttributes({ class: 'comment' }));
      return generateTag('div', nameDiv + timeStamp + commentDiv);
    }
  );
  return commentsDiv.join('');
};

const addHead = (form, comments) => {
  const body = generateTag('body', form + comments);
  const head = generateHead();
  return generateTag('html', head + body);
};

module.exports = { commentsToHTML, addHead };
