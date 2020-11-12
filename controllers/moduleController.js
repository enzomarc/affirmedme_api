const Module = require('../models/module');
const ModuleStep = require('../models/module_step');


exports.basic = async (req, res, next) => {
    await Module.find({type: 'basic'}, (err, doc) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Unable to get all the basic modules.", error: err });
        }

        if (doc) {
            return res.json(doc);
        }
    });
}

exports.premium = async (req, res, next) => {
    await Module.find({ type: 'premium' }, (err, doc) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Unable to get all the basic modules.", error: err });
        }

        if (doc) {
            return res.json(doc);
        }
    });
}

exports.store = async (req, res, next) => {
    const data = req.body;

    
}