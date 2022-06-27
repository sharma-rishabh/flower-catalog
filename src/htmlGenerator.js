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

const createNameDiv = (name) => {
  return generateTag(
    'div',
    `From ${name}`,
    createAttributes({ class: 'name' })
  );
};

const createTimeStampDiv = (timeStamp) => {
  return generateTag(
    'div',
    `At ${timeStamp} :`,
    createAttributes({ class: 'time-stamp' })
  );
};

const createCommentDiv = (comment) => {
  return generateTag(
    'p',
    comment,
    createAttributes({ class: 'comment' })
  );
};

const commentsToHTML = (comments) => {
  const commentsDiv = [];

  for (let index = comments.length - 1; index >= 0; index--) {
    const { name, comment, dateTime } = comments[index];
    const nameDiv = createNameDiv(name);
    const timeStamp = createTimeStampDiv(dateTime);
    const commentDiv = createCommentDiv(comment);
    commentsDiv.push(generateTag('div', nameDiv + timeStamp + commentDiv));
  }
  return commentsDiv.join('');
}



const addHead = (form, comments) => {
  const body = generateTag('body', form + comments);
  const head = generateHead();
  return generateTag('html', head + body);
};

module.exports = { commentsToHTML, addHead };
