const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const constants = require('../util/constants');

/**
 * User authentication route.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.auth = async (req, res) => {
  const credentials = { email: req.body.email, password: req.body.password };

  await User.findOne({ email: credentials.email }, async (err, user) => {
    if (err) {
        console.error(err);
        return res.status(401).json({ message: "An error occurred during user login.", error: err });
    }

    console.log(user);

    if (user == null)
        return res.status(401).json({ message: "E-mail address or password are invalid." });

    if (!user.active)
        return res.status(401).json({ message: "Unable to login, your user account is disabled." });

    if (bcrypt.compareSync(credentials.password, user.password)) {
        const payload = { id: user._id, email: user.email, name: user.name, avatar: user.avatar };
        const token = jwt.sign(payload, constants.TOKEN_SECRET, { expiresIn: '3 hours' });

        return res.json({ access_token: token, user: payload });
    } else {
        return res.status(401).json({ message: "E-mail address or password are invalid." });
    }
  });
}

/**
 * User token verification route.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.verify = async (req, res) => {
  const token = req.params.token;

  jwt.verify(token, constants.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: "Corrupted token emitted." });
    }

    await User.findOne({ email: decoded.email }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: "An error occurred during token verification." });
        }

        if (!user)
            return res.status(401).json({ message: "Unable to get information of the logged user." });

        if (!user.active)
            return res.status(401).json({ message: "Your user account is disabled." });

        return res.json({ user: decoded });
    });
  });
}
