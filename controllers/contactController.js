const User = require('../models/user');
const Contact = require('../models/contact');

/**
 * Get contacts of the given user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const id = req.params.user;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to get user contacts.", error: err });
    }

    let contacts = [];

    if (user) {
      if (!user.active)
        return res.status(401).json({ message: "User account is disabled." });

      contacts = await Contact.find({ user: id });
    }

    return res.json(contacts);
  });
}

/**
 * Store newly created contact.
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
      await Contact.find({ user: user._id, email: data.email }, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred, unable to save contact.", error: err });
        }

        if (result.length > 0) return res.json(true);
        else {
          data.user = user._id;
          const contact = new Contact(data);

          await contact.save((err, saved) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "An error occurred, unable to save contact.", error: err });
            }
    
            return res.status(201).json({ message: "Contact saved successfully.", contact: saved });
          });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Update the given contact with new data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.user;
  const contact_id = req.params.contact;
  const data = req.body;

  await User.findById(id, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified user.", error: err });
    }

    if (user) {
      await Contact.findById(contact_id, async (err, contact) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to find the specified contact.", error: err });
        }

        if (contact) {
          await contact.update(data);
          return res.json({ message: "Contact updated successfully.", contact: contact });
        } else {
          return res.status(500).json({ message: "Unable to find the specified contact." });
        }
      });
    } else {
      return res.status(500).json({ message: "Unable to find the specified user." });
    }
  });
}

/**
 * Delete the given contact.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const uid = req.params.user;
  const id = req.params.contact;

  await Contact.findById(id, async (err, contact) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified contact.", error: err });
    }

    if (contact && contact.user == uid) {
      await contact.deleteOne();
      return res.json({ message: "Contact deleted successfully." });
    } else {
      return res.status(500).json({ message: "Unable to delete the contact." });
    }
  });
}