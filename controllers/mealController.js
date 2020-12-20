const User = require('../models/user');
const Meal = require('../models/meal');

/**
 * Get meals of the given user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to get user meals.", error: err });
    }

    let meals = [];

    if (user) {
      if (!user.active)
        return res.status(401).json({ message: "User account is disabled." });

      meals = await Meal.find({ user: id });
    }

    return res.json(meals);
  });
}

/**
 * Store newly created meal.
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
      await Meal.find({ user: user._id, title: data.title }, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred, unable to save meal.", error: err });
        }

        if (result.length > 0) return res.json(true);
        else {
          data.user = user._id;
          const meal = new Meal(data);

          await meal.save((err, saved) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "An error occurred, unable to save meal.", error: err });
            }
    
            return res.status(201).json({ message: "Meal saved successfully.", meal: saved });
          });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Update the given meal with new data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.user;
  const meal_id = req.params.meal;
  const data = req.body;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Meal.findById(meal_id, async (err, meal) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to find the specified meal.", error: err });
        }

        if (meal) {
          await meal.update(data);
          return res.json({ message: "Meal updated successfully.", meal: meal });
        } else {
          return res.status(500).json({ message: "Unable to find the specified meal." });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Delete the given meal.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const uid = req.params.user;
  const id = req.params.meal;

  await Meal.findById(id, async (err, meal) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified meal.", error: err });
    }

    if (meal && meal.user == uid) {
      await meal.deleteOne();
      return res.json({ message: "Meal plan deleted successfully." });
    } else {
      return res.status(500).json({ message: "Unable to delete the meal plan." });
    }
  });
}