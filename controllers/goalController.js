const User = require('../models/user');
const Goal = require('../models/goal');

/**
 * Get goals of the given user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to get user goals.", error: err });
    }

    let goals = [];

    if (user) {
      if (!user.active)
        return res.status(401).json({ message: "User account is disabled." });

      goals = await Goal.find({ user: id });
    }

    return res.json(goals);
  });
}

/**
 * Store newly created goal.
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
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Goal.find({ user: user._id }, async (err, goals) => {
        if (err) console.error(err);

        goals.forEach(async (goal) => {
          await goal.deleteOne();
        });
      }).catch((err) => console.error(err));

      Object.keys(data).forEach(objective => {
        const goals = data[objective];

        goals.forEach(async (content) => {
          await Goal.find({ user: user._id, objective: objective, content: content }, async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "An error occured during save.", error: err });
            }

            if (result.length <= 0) {
              const goal = new Goal({ user: user._id, objective: objective, content: content });
              await goal.save((err, saved) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ message: "An error occured during save.", error: err });
                }
              });
            } else {
              console.log("Goal already exists.");
            }
          });
        });
      });

      return res.status(201).json({ message: "Goals saved successfully.", goals: data });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Update the given goal with new data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.user;
  const goal_id = req.params.goal;
  const data = req.body;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Goal.findById(goal_id, async (err, goal) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to find the specified goal.", error: err });
        }

        if (goal) {
          await goal.update(data);
          return res.json({ message: "Goal updated successfully.", goal: goal });
        } else {
          return res.status(500).json({ message: "Unable to find the specified goal." });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Delete the given goal.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.goal;

  await Goal.findById(id, async (err, goal) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified goal.", error: err });
    }

    if (goal)
      await goal.deleteOne();

    return res.json({ message: "Goal deleted successfully." });
  });
}