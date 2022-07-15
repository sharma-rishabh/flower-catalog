const parseCookies = (req, res, next) => {
  const rawCookies = req.headers.cookie;
  const cookies = {};

  if (!rawCookies) {
    req.cookies = cookies;
    next();
    return;
  }

  rawCookies.split(';').forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookies[name] = value;
  });
  req.cookies = cookies;
  next();
};

module.exports = { parseCookies }
