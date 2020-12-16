const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

// Controllers
const moduleController = require('../controllers/moduleController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const tipController = require('../controllers/tipController');
const audioController = require('../controllers/audioController');
const reminderController = require('../controllers/reminderController');
const goalController = require('../controllers/goalController');
const contactController = require('../controllers/contactController');

// Middleware
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");


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
router.get('/check/:token', userController.check);

// Modules
router.get('/modules/basic', auth, moduleController.basic);
router.get('/modules/premium/:user', auth, moduleController.premium);
router.post('/modules', auth, moduleController.store);
router.delete('/modules/:module', auth, moduleController.delete);

// Tips
router.get('tips', auth, tipController.index);
router.get('daily_tip', auth, tipController.daily);
router.get('/tips/:tip', auth, tipController.show);
router.post('/tips', auth, tipController.store);
router.post('/tips/:tip/update', auth, tipController.update);
router.delete('/tips/:tip', auth, tipController.delete);

// Audios
router.get('/audios', auth, audioController.index);
router.get('/audios/categories', auth, audioController.categories);
router.get('/audios/:audio', auth, audioController.show);
router.post('/audios', auth, multer, audioController.store);
router.post('/audios/:audio/update', multer, auth, audioController.update);
router.delete('/audios/:audio', auth, audioController.delete);

// Reminders
router.get('/reminders/:user', auth, reminderController.index);
router.post('/reminders/:user', auth, reminderController.store);
router.put('/reminders/:user/:reminder', auth, reminderController.update);
router.delete('/reminders/:user/:reminder', auth, reminderController.delete);

// Goals
router.get('/goals/:user', auth, goalController.index);
router.post('/goals/:user', auth, goalController.store);
router.put('/goals/:user/:goal', auth, goalController.update);
router.delete('/goals/:goal', auth, goalController.delete);

// Contacts
router.get('/contacts/:user', auth, contactController.index);
router.post('/contacts/:user', auth, contactController.store);
router.put('/contacts/:user/:contact', auth, contactController.update);
router.delete('/contacts/:contact', auth, contactController.delete);

module.exports = router;
