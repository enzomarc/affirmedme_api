const multer = require('multer');

const MIME_TYPES = {
  'audio/wav': 'wav',
  'audio/mp3': 'mp3',
  'audio/ma4': 'ma4',
  'audio/mpeg': 'mp3',
  'image/gif': 'gif',
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'application/octet-stream': 'mp3'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'content/upload')
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype] ? MIME_TYPES[file.mimetype] : 'file';

    callback(null, Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage }).any();