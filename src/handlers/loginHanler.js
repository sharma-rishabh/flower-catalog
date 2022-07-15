const createSession = username => {
  const time = new Date();
  return { sessionId: time.getTime(), time, username };
};

const authenticateUser = (users, userDetails) => {
  const user = users[userDetails.username];
  if (user) {
    return user.password === userDetails.password;
  }
  return false;
};

const fieldsAbsent = ({ username, password }) => {
  return !username || !password;
};

const login = (sessions, users) => (request, response) => {
  if (request.session) {
    response.redirect('/guest-book');
    return;
  }

  if (fieldsAbsent(request.body)) {
    response.status(400);
    const status = { success: false, message: 'All fields required' };
    response.json(status);
    return;
  }

  if (!authenticateUser(users, request.body)) {
    response.status(422);
    const status = { success: false, message: 'Invalid username or password' };
    response.json(status);
    return;
  }

  const session = createSession(request.body.username);
  response.cookie('sessionId', session.sessionId);
  sessions[session.sessionId] = session;
  response.redirect('/guest-book');
  return;
};

const serveLoginForm = (request, response) => {
  if (request.session) {
    response.redirect('/guest-book');
    return;
  }
  response.redirect('/login.html');
};


module.exports = { login, serveLoginForm };