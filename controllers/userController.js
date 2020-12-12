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

    // disable user account if registration is premium
    if (data.premium)
        data.active = false;

    const emailExists = await User.findOne({ email: data.email });
    const phoneExists = await User.findOne({ phone: data.phone });

    if (!emailExists && !phoneExists) {
        const user = new User(data);
        await user.save();

        const payload = { id: user._id, name: user.name, email: user.email, phone: user.phone, premium: user.premium };
        const token = jwt.sign(payload, constants.TOKEN_SECRET, { expiresIn: '7d' });

        console.log(payload);

        return res.status(201).json({ message: "User account created successfully.", token: token, user: user });
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
            const token = jwt.sign(payload, constants.TOKEN_SECRET, { expiresIn: '7d' });

            return res.json({ token: token, user: payload });
        }

        return res.status(401).json({ message: "Invalid e-mail address or password." });
    });
}

/**
 * Check user account.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.check = async (req, res) => {
    const token = req.params.token;
    jwt.verify(token, constants.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: "Invalid token provided.", error: err });
        }

        const id = decoded.id;

        await User.findById(id, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ message: "Unable to find the user account.", error: err });
            }

            if (user) {
                if (!user.active)
                    return res.status(401).json({ message: "User account disabled." });

                const token = jwt.sign(decoded, constants.TOKEN_SECRET, { expiresIn: '7d' });
                return res.json({ token: token, user: decoded });
            } else {
                return res.status(401).json({ message: "Unable to find the user account.", error: err });
            }
        });
    });
}