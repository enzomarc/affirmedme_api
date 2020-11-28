const request = require('request');
const app = require('../app');

/**
 * Web client login route
 * 
 * @param {import('express').Request} req 
 * @param {*} res 
 */
exports.login = (req, res) => {
  const token = req.params.token;

  if (!token)
    return res.status(401).json({ message: "Invalid token provided." });

  request.get(req.protocol + '://' + req.hostname + '/api/auth/verify/' + token, (error, response, body) => {
    if (error) {
      console.error(error);
      req.session.destroy();
      res.clearCookie('access_token');
      return res.status(401).json({ message: "Invalid token provided.", error: error });
    }

    if (response.statusCode == 200) {
      req.session.user = JSON.parse(body).user;
      res.cookie('access_token', token);

      req.session.save();
      return res.json({ message: 'success' });
    } else {
      console.log(response);
      req.session.destroy();
      res.clearCookie('access_token');
      return res.status(401).json({ message: "Invalid token provided.", error: error });
    }
  });
}

exports.page = (req, res) => {
  if (req.session.user && req.cookies.access_token) {
    return res.redirect('/');
  } else {
    return res.render('login', { layout: false });
  }
}

exports.logout = (req, res) => {
  req.session.destroy();
  res.clearCookie('access_token');
  return res.redirect('/login');
}