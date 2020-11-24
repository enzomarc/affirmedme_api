const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

// Controllers
const moduleController = require('../controllers/moduleController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const tipController = require('../controllers/tipController');
const audioController = require('../controllers/audioController');

// Middleware
const multer_audios = require("../middlewares/multer_audios");


// CORS Middleware
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Content-Type", "application/json");
  next();
});

// Parse request body
router.use(bodyParser.json({ strict: false }));
router.use(bodyParser.urlencoded({ extended: false }));

// Automatically set authorization header from session if user logged in
router.use((req, res, next) => {
  if (req.session.user && req.cookies.access_token) {
    const token = req.cookies.access_token;
    req.headers.authorization = token;
    res.setHeader('authorization', token);
  }

  next();
});



router.get("/", (req, res, next) => {
  return res.json({ app: "AffirmedMe API", version: "v1.0.0" });
});

// Admin Auth
router.post('/auth', authController.auth);
router.get('/auth/verify/:token', authController.verify);

// User Auth
router.post('/register', userController.register);
router.post('/login', userController.login);

// Modules
router.get('/modules/basic', moduleController.basic);
router.get('/modules/premium', moduleController.premium);
router.post('/modules', moduleController.store);

// Tips
router.get('tips', tipController.index);
router.get('daily_tip', tipController.daily);
router.get('/tips/:tip', tipController.show);
router.post('/tips', tipController.store);
router.post('/tips/:tip/update', tipController.update);
router.delete('/tips/:tip', tipController.delete);

// Audios
router.get('/audios', audioController.index);
router.get('/audios/:audio', audioController.show);
router.post('/audios', multer_audios, audioController.store);
router.post('/audios/:audio/update', multer_audios, audioController.update);
router.delete('/audios/:audio', audioController.delete);



module.exports = router;
