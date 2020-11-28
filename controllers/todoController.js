const User = require('../models/user');
const Todo = require('../models/todo');

exports.index = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to get user todos.", error: err });
    }

    let todos = [];

    if (user) {
      if (!user.active)
        return res.status(401).json({ message: "User account is disabled." });

      todos = await Todo.find({ author: id });
    }

    return res.json(todos);
  });
}

/**
 * Store newly created todo.
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
      data.author = user._id;
      const todo = new Todo(data);
      await todo.save();
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Update the given todo with new data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.user;
  const todo_id = req.params.todo;
  const data = req.body;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Todo.findById(todo_id, async (err, todo) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to find the specified todo.", error: err });
        }

        if (todo) {
          await todo.update(data);
          return res.json({ message: "Todo updated successfully.", todo: todo });
        } else {
          return res.status(500).json({ message: "Unable to find the specified todo." });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Delete the given todo.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.todo;

  await Todo.findById(id, async (err, todo) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified todo.", error: err });
    }

    if (todo)
      await todo.deleteOne();

    return res.json({ message: "Todo deleted successfully." });
  });
}