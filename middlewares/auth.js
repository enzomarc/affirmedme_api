const jwt = require('jsonwebtoken');
const Constants = require('../util/constants');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: "You don't have required authorization." });

  jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "You don't have required authorization." });
      
    return next();
  });
}