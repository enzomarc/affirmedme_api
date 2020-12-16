const User = require('../models/user');
const Reminder = require('../models/reminder');

/**
 * Get reminders of the given user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to get user reminders.", error: err });
    }

    let reminders = [];

    if (user) {
      if (!user.active)
        return res.status(401).json({ message: "User account is disabled." });

      reminders = await Reminder.find({ user: id, done: false });
    }

    return res.json(reminders);
  });
}

/**
 * Store newly created reminder.
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
      await Reminder.find({ user: user._id, group: data.group, content: data.content }, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred, unable to save reminder.", error: err });
        }

        if (result.length > 0) return res.json(true);
        else {
          data.user = user._id;
          const reminder = new Reminder(data);

          await reminder.save((err, saved) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "An error occurred, unable to save reminder.", error: err });
            }
    
            return res.status(201).json({ message: "Reminder saved successfully.", reminder: saved });
          });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Update the given reminder with new data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.user;
  const reminder_id = req.params.reminder;
  const data = req.body;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Reminder.findById(reminder_id, async (err, reminder) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to find the specified reminder.", error: err });
        }

        if (reminder) {
          await reminder.update(data);
          return res.json({ message: "Reminder updated successfully.", reminder: reminder });
        } else {
          return res.status(500).json({ message: "Unable to find the specified reminder." });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Delete the given reminder.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const uid = req.params.user;
  const id = req.params.reminder;

  await Reminder.findById(id, async (err, reminder) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified reminder.", error: err });
    }

    if (reminder && reminder.user == uid) {
      await reminder.deleteOne();
      return res.json({ message: "Reminder deleted successfully." });
    } else {
      return res.status(500).json({ message: "Unable to delete the reminder." });
    }
  });
}