const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../util/constants');
const User = require('../models/user');


/**
 * User registration.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.register = async (req, res) => {
    const data = req.body;
    data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());

    const emailExists = await User.findOne({ email: data.email });
    const phoneExists = await User.findOne({ phone: data.phone });

    if (!emailExists && !phoneExists) {
        const user = new User(data);
        await user.save();

        return res.status(201).json({ message: "User account created successfully.", user: user });
    }

    return res.status(500).json({ message: "User with same phone or e-mail address already exists." });
}

/**
 * User authentication.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.login = async (req, res) => {
    const credentials = req.body;

    await User.findOne({ email: credentials.email }, async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred during login.", error: err });
        }

        if (user) {
            if (!user.active)
                return res.status(401).json({ message: "Your user account is disabled." });

            if (!bcrypt.compareSync(credentials.password, user.password))
                return res.status(401).json({ message: "Invalid e-mail address or password." });

            const payload = { id: user._id, name: user.name, email: user.email, phone: user.phone, premium: user.premium };
            const token = jwt.sign(payload, constants.TOKEN_SECRET, { expiresIn: '24h' });

            return res.json({ token: token, user: payload });
        }

        return res.status(401).json({ message: "Invalid e-mail address or password." });
    });
}