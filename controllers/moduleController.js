const Module = require("../models/module");
const User = require("../models/user");

/**
 * Show modules page.
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
 * Show module creation page.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {
  const error = req.flash("error");
  const info = req.flash("info");
	const success = req.flash("success");
  const _messages = { success: success, info: info, error: error };

  return res.render("modules/create", { layout: "main", title: "Create module", messages: _messages });
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

    return res.json(doc);
  });
};

/**
 * Get premium modules.
 *
 * @param {*} req
 * @param {*} res
 */
exports.premium = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      if (user.premium) {
        await Module.find({ type: "premium" }, (err, modules) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Unable to get all the basic modules.", error: err });
          }
      
          return res.json(modules);
        });
      } else {
        return res.status(401).json({ message: "You don't have access to premium modules." });
      }
    } else {
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }
  });
};

/**
 * Load checked items from modules.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.checked = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      let goals = [];
      let checked = [];

      await Module.find((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred, unable to load checked goals.", error: err });
        }

        result.forEach((module) => {
          module.steps.forEach((step) => {
            step.goals.forEach((goal) => goals.push(goal));
          });
        });
      });

      goals.forEach((goal) => {
        if (goal.checked) checked.push(goal);
      });

      return res.json(checked);
    } else {
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }
  });
}

/**
 * Toggle module item check state.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.check = async (req, res) => {
  const id = req.params.user;
  const title = req.body.title;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      let goals = [];

      await Module.find((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred, unable to load checked goals.", error: err });
        }

        result.forEach((module) => {
          module.steps.forEach((step) => {
            step.goals.forEach(async (goal) => {
              if (goal.title.toLowerCase() == title) {
                goal.checked = !goal.checked;
                await module.save();

                return res.json(goal.checked);
              }
            });
          });
        });
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }
  });
}

/**
 * Store newly created module.
 *
 * @param {*} req
 * @param {*} res
 */
exports.store = async (req, res) => {
  const data = req.body;

  if (data) {
    const data_steps = data.step;
    const module_title = data.title;
    const module_steps = [];

    data_steps.forEach(step => {
      const goals = step.goal;
      const step_data = { title: step['step-title'], goals: [] };

      goals.forEach(goal => {
        const goal_data = { title: goal['goal-title'], tips: goal.tip ? goal.tip.map(item => item['goal-title']) : [] };
        step_data.goals.push(goal_data);
      });

      module_steps.push(step_data);
    });

    const module_data = { title: module_title, steps: module_steps, type: data.type };
    const module = new Module(module_data);

    await module.save((err, succ) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred during module creation.", error: err });
      }

      if (succ)
        return res.status(201).json({ message: "Module successfully created.", module: succ });
    });
  }
};

/**
 * Delete the given module.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.module;

  await Module.findById(id, async (err, doc) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred during module deletion. ", error: err });
    }

    if (doc) {
      doc.deleteOne();
      return res.json({ message: "Module deleted successfully." });
    }
  });
};