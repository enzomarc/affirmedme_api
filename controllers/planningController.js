const Planning = require('../models/planning');
const User = require('../models/user');

/**
 * Get planning of the given user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the given user.", error: err });
    }

    if (user) {
      await Planning.find({ user: id }, (err, planning) => {
        if (err) {
          return res.status(500).json({ message: "Unable to get the user planning.", error: err });
        }

        return res.json(planning);
      });
    } else {
      return res.status(500).json({ message: "Unable to find the given user." });
    }
  });
}

/**
 * Create and store new planning.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  const id = req.params.user;
  const data = req.body;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the given user.", error: err });
    }

    if (user) {
      data.user = user._id;
      let planning = await Planning.findOne({ activity: data.activity });

      if (!planning) {
        planning = new Planning(data);

        await planning.save((err, saved) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Unable to save the planning.", error: err });
          }
  
          return res.status(201).json({ message: "Planning saved successfully.", planning: saved });
        });
      } else {
        return res.status(500).json({ message: "Planning with same title/activity already exists.", error: err });
      }
    } else {
      return res.status(500).json({ message: "Unable to find the given user." });
    }
  });
}

/**
 * Update the given planning.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.plan;
  const usr = req.params.user;
  const data = req.body;

  await User.findById(usr, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the given user.", error: err });
    }

    if (user) {
      data.user = user._id;
      let planning = await Planning.findById(id);

      if (!planning) {
        return res.status(500).json({ message: "Unable to retrieve the given planning.", error: err });
      } else {
        await planning.updateOne(data, (err, saved) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Unable to update the planning.", error: err });
          }
  
          return res.json({ message: "Planning updated successfully.", planning: saved });
        });
      }
    } else {
      return res.status(500).json({ message: "Unable to find the given user." });
    }
  });
}

/**
 * Delete the given planning.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const usr = req.params.user;
  const id = req.params.plan;

  await User.findById(usr, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the given user.", error: err });
    }

    if (user) {
      await Planning.findById(id, async (err, planning) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to get the given planning.", error: err });
        }
  
        if (planning) {
          await planning.deleteOne();
          return res.json({ message: "Planning deleted successfully." });
        } else {
          return res.status(500).json({ message: "Unable to get the given planning." });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the given user." });
    }
  });
}