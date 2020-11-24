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
      return res.status(500).json({ message: "Unable to find audios.", error: err });
    }

    return res.json(audios);
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
      return res.status(500).json({ message: "Unable to find the specified audio.", error: err });
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
      req.flash('error', "An error occurred during audio creation.");
      return res.status(500).redirect('/audios');
    }

    if (audio) {
      req.flash('error', "An audio with the same title already exists.");
      return res.status(500).redirect('/audios');
    }

    if (req.file) {
      data.path = `/content/upload/audios/${req.file.filename}`;
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
      req.flash('error', "Unable to find specified audio.");
      return res.status(500).redirect('/audios');
    }

    if (audio) {
      if (req.file) {
        data.path = `/content/upload/audios/${req.file.filename}`;
      }

      await audio.update(data, async (err, result) => {
        if (err) {
          console.error(err);
          req.flash('error', "An error occurred during audio update.");
          return res.status(500).redirect('/audios');
        }

        req.flash('success', "Audio updated successfully.");
      });
    } else {
      req.flash('error', "Unable to find the specified audio.");
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
      req.flash('error', "Unable to find the specified audio.");
      return res.status(500).redirect('/audios');
    }

    // console.log(fs.existsSync(`${req.protocol}://${req.get('host')}/content/upload/audios/${audio.path}`));

    if (audio) {
      // if (fs.existsSync('..' + audio.path))
      //   fs.unlinkSync('..' + audio.path);

      await audio.deleteOne();
      req.flash('success', "Audio file deleted successfully.");
    }

    return res.redirect('/audios');
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

    return res.render('audios', { layout: "main", title: "Audios", messages: _messages, populated: populated, audios: audios });
  });
}