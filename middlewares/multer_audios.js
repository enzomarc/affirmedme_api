const multer = require('multer');

const MIME_TYPES = {
  'audio/wav': 'wav',
  'audio/mp3': 'mp3',
  'audio/ma4': 'ma4',
  'audio/mpeg': 'mp3',
  'application/octet-stream': 'mp3'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'content/upload/audios')
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype] ? MIME_TYPES[file.mimetype] : 'mp3';

    callback(null, Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage, limits: { files: 1 } }).single('audio');