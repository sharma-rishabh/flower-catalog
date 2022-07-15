const serveSignupForm = (request, response) => {
  if (request.session) {
    response.redirect('/');
    return;
  }
  response.redirect('/signup.html');
  return;
};

const fieldsAbsent = ({ username, password }) => {
  return !username || !password;
};

const userExists = (users, { username }) => {
  return users[username] ? true : false;
}

const signup = (path, users, fs) => (request, response) => {
  if (request.session) {
    response.redirect('/');
    return;
  }

  const user = request.body;
  if (fieldsAbsent(request.body)) {
    response.status(400);
    const status = { success: false, message: 'All fields required' };
    response.json(status);
    return;
  }

  if (userExists(users, user)) {
    const status = { success: false, message: 'User already exists' };
    response.status(409);
    response.json(status);
    return;
  }

  users[user.username] = user;
  fs.writeFileSync(path, JSON.stringify(users), 'utf8');
  const status = { success: true, message: 'Signup Successful' };
  response.json(status);
  return;
};

module.exports = { serveSignupForm, signup }
