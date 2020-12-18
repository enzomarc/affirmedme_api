const User = require('../models/user');
const Date = require('../models/date');

/**
 * Get dates of the given user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to get user dates.", error: err });
    }

    let dates = [];

    if (user) {
      if (!user.active)
        return res.status(401).json({ message: "User account is disabled." });

      dates = await Date.find({ user: id });
    }

    return res.json(dates);
  });
}

/**
 * Store newly created date.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  const id = req.params.user;
  const data = req.body;

  console.log(data);
  
  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Date.find({ user: user._id, label: data.label, at: data.at }, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred, unable to save date.", error: err });
        }

        if (result.length > 0) return res.json(true);
        else {
          data.user = user._id;
          const date = new Date(data);

          await date.save((err, saved) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "An error occurred, unable to save date.", error: err });
            }
    
            return res.status(201).json({ message: "Date saved successfully.", date: saved });
          });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Update the given date with new data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.user;
  const date_id = req.params.date;
  const data = req.body;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Date.findById(date_id, async (err, date) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to find the specified date.", error: err });
        }

        if (date) {
          await date.update(data);
          return res.json({ message: "Date updated successfully.", date: date });
        } else {
          return res.status(500).json({ message: "Unable to find the specified date." });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Delete the given date.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const uid = req.params.user;
  const id = req.params.date;

  await Date.findById(id, async (err, date) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified date.", error: err });
    }

    if (date && date.user == uid) {
      await date.deleteOne();
      return res.json({ message: "Date deleted successfully." });
    } else {
      return res.status(500).json({ message: "Unable to delete the date." });
    }
  });
}