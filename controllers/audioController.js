const Audio = require('../models/audio');
const fs = require('fs');

/**
 * Get audios.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  await Audio.find((err, audios) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find podcasts.", error: err });
    }

    return res.json(audios);
  });
}

/**
 * Get audios categories.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.categories = async (req, res) => {
  await Audio.find((err, audios) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find podcasts.", error: err });
    }

    let categories = [];

    audios.forEach((audio) => {
      if (!categories.includes(audio.category)) categories.push(audio.category);
    });

    return res.json(categories);
  });
}

/**
 * Get given audio information.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.show = async (req, res) => {
  const id = req.params.audio;

  await Audio.findById(id, (err, audio) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified podcast.", error: err });
    } 

    return res.json(audio);
  });
}

/**
 * Store a newly created audio.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  const data = req.body;

  await Audio.findOne({ title: data.title }, async (err, audio) => {
    if (err) {
      console.error(err);
      req.flash('error', "An error occurred during podcast creation.");
      return res.status(500).redirect('/audios');
    }

    if (audio) {
      req.flash('error', "An podcast with the same title already exists.");
      return res.status(500).redirect('/audios');
    }

    if (req.files.length > 1) {
      data.path = `/upload/${req.files[0].filename}`;
      data.image = `/upload/${req.files[1].filename}`;
      const audio = new Audio(data);

      await audio.save((err, saved) => {
        if (err) {
          console.error(err);
          req.flash('error', "An error occurred during audio creation.");
          return res.status(500).redirect('/audios');
        }

        req.flash('success', "Audio created successfully.");
        return res.status(201).redirect('/audios');
      });
    } else {
      req.flash('error', "Can't find the audio file.");
      return res.status(500).redirect('/audios');
    }
  });
}

/**
 * Update the given audio.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const id = req.params.audio;
  const data = req.body;

  await Audio.findById(id, async (err, audio) => {
    if (err) {
      console.error(err);
      req.flash('error', "Unable to find specified podcast.");
      return res.status(500).redirect('/audios');
    }

    if (audio) {
      if (req.file) {
        data.path = `/content/upload/audios/${req.file.filename}`;
      }

      await audio.update(data, async (err, result) => {
        if (err) {
          console.error(err);
          req.flash('error', "An error occurred during podcast update.");
          return res.status(500).redirect('/audios');
        }

        req.flash('success', "Podcast updated successfully.");
      });
    } else {
      req.flash('error', "Unable to find the specified podcast.");
    }

    return res.redirect('/audios');
  });
}

/**
 * Delete the given audio.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.audio;

  await Audio.findById(id, async (err, audio) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to find the specified audio.", error: err });
    }

    // console.log(fs.existsSync(`${req.protocol}://${req.get('host')}/content/upload/audios/${audio.path}`));

    if (audio) {
      // if (fs.existsSync('..' + audio.path))
      //   fs.unlinkSync('..' + audio.path);

      await audio.deleteOne();
      return res.json({ message: "Podcast deleted successfully." });
    } else {
      return res.status(500).json({ message: "Unable to find the specified podcast.", error: err });
    }
  });
}

/**
 * Show audios list page.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.page = async (req, res) => {
  const error = req.flash("error");
  const info = req.flash("info");
  const success = req.flash("success");
  const _messages = { success: success, info: info, error: error };

  await Audio.find((err, audios) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to get audios list.", error: err });
    }

    const populated = audios.length > 0;

    return res.render('audios', { layout: "main", title: "Podcasts", messages: _messages, populated: populated, audios: audios });
  });
}