const createInjectSession = (sessions) => {
  return (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies.sessionId) {
      next();
      return;
    }

    const session = sessions[cookies.sessionId];
    req.session = session;
    next();
  };
};

module.exports = { createInjectSession };
