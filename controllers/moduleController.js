const Module = require("../models/module");
const ModuleStep = require("../models/module_step");

exports.page = async (req, res) => {
  const error = req.flash("error");
  const info = req.flash("info");
	const success = req.flash("success");
	const _messages = { success: success, info: info, error: error };

  await Module.find((err, modules) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred during modules research.", error: err });
		}
		
		const populated = modules.length > 0;

    return res.render("modules", { layout: "main", title: "Modules", modules: modules, populated: populated, messages: _messages });
  });
};

/**
 * Get basic modules.
 *
 * @param {*} req
 * @param {*} res
 */
exports.basic = async (req, res) => {
  await Module.find({ type: "basic" }, (err, doc) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Unable to get all the basic modules.", error: err });
    }

    if (doc) {
      return res.json(doc);
    }
  });
};

/**
 * Get premium modules.
 *
 * @param {*} req
 * @param {*} res
 */
exports.premium = async (req, res) => {
  await Module.find({ type: "premium" }, (err, doc) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Unable to get all the basic modules.", error: err });
    }

    if (doc) {
      return res.json(doc);
    }
  });
};

/**
 * Store newly created module.
 *
 * @param {*} req
 * @param {*} res
 */
exports.store = async (req, res) => {
  const data = req.body;

  const module = new Module(data);
  await module.save();

  return res.status(201).json(module);
};
