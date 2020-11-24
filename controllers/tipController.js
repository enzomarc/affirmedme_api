const Tip = require('../models/tip');


/**
 * Show tips list page.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.page = async (req, res) => {
  const error = req.flash("error");
  const info = req.flash("info");
	const success = req.flash("success");
	const _messages = { success: success, info: info, error: error };

  await Tip.find((err, tips) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred during tips research.", error: err });
		}
		
    const populated = tips.length > 0;

    return res.render("tips", { layout: "main", title: "Daily Tips", tips: tips, populated: populated, messages: _messages });
  });
};

/**
 * Get tip information.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.show = async (req, res) => {
  const id = req.params.tip;

  await Tip.findById(id, (err, tip) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Can't find tip with id " + id, error: err });
    }

    if (tip)
      return res.json(tip);
  });
};

/**
 * Store a newly created tip.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  const data = req.body;
  const tip = new Tip(data);

  await tip.save({}, (err, saved) => {
    if (err) {
      console.error(err);
      req.flash('error', "An error occurred during tip creation.");
      return res.status(500).redirect('/tips');
    }

    if (saved) {
      req.flash('success', "Tip added successfully.");
      return res.redirect('/tips');
    }
    
    req.flash('error', "An error occurred during tip creation.");
    return res.status(500).redirect('/tips');
  });
};

/**
 * Update the given tip.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.tip;
  const data = req.body;

  await Tip.findById(id, async (err, tip) => {
    if (err) {
      console.error(err);
      req.flash('error', "An error occurred during tip update.");
      return res.status(500).redirect('/tips');
    }

    if (tip) {
      await tip.update(data, (err, result) => {
        if (err) {
          req.flash('error', "An error occurred during tip update.");
          return res.status(500).redirect('/tips');
        }

        req.flash('success', "Tip updated successfully.");
        return res.redirect('/tips');
      });
    } else {
      req.flash('error', "An error occurred during tip update.");
      return res.status(500).redirect('/tips');
    }
  });
};

/**
 * Delete given tip.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.tip;

  await Tip.findOne({_id: id}, async (err, tip) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred during tip delete.", error: err });
    }

    if (tip) {
      await tip.deleteOne((err, doc) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred during tip delete.", error: err });
        }
  
        return res.json({ message: "Tip deleted successfully." });
      });
    } else {
      return res.status(500).json({ message: "An error occurred during tip delete." });
    }
  });
}