const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

// Controllers
const paymentController = require('../controllers/paymentController');
const moduleController = require('../controllers/moduleController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const tipController = require('../controllers/tipController');
const audioController = require('../controllers/audioController');
const reminderController = require('../controllers/reminderController');
const dateController = require('../controllers/dateController');
const goalController = require('../controllers/goalController');
const contactController = require('../controllers/contactController');
const ocrController = require('../controllers/ocrController');
const mealController = require('../controllers/mealController');
const planningController = require('../controllers/planningController');

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
router.post('/users/:id/upgrade', userController.upgrade);

// Payments
router.post('/payments/create', paymentController.create);
router.post('/payments/:payment/confirm', paymentController.confirm);
router.post('/payments/cards', paymentController.addCard);

// Modules
router.get('/modules/basic', auth, moduleController.basic);
router.get('/modules/premium/:user', auth, moduleController.premium);
router.get('/modules/:user/checked', auth, moduleController.checked);
router.post('/modules', auth, moduleController.store);
router.post('/modules/:user/check', auth, moduleController.check);
router.delete('/modules/:module', auth, moduleController.delete);

// Tips
router.get('/tips', auth, tipController.index);
router.get('/daily_tip', tipController.daily);
router.get('/tips/:tip', auth, tipController.show);
router.post('/tips', auth, tipController.store);
router.post('/tips/:tip/update', auth, tipController.update);
router.delete('/tips/:tip', auth, tipController.delete);

// Audios
router.get('/audios', audioController.index);
router.get('/audios/categories', audioController.categories);
router.get('/audios/:audio', audioController.show);
router.post('/audios', multer, audioController.store);
router.post('/audios/:audio/update', multer, audioController.update);
router.delete('/audios/:audio', audioController.delete);

//OCR
router.post('/ocr-scan', auth, ocrController.scan);

// Reminders
router.get('/reminders/:user', auth, reminderController.index);
router.post('/reminders/:user', auth, reminderController.store);
router.put('/reminders/:user/:reminder', auth, reminderController.update);
router.delete('/reminders/:user/:reminder', auth, reminderController.delete);

// Dates
router.get('/dates/:user', auth, dateController.index);
router.post('/dates/:user', auth, dateController.store);
router.put('/dates/:user/:date', auth, dateController.update);
router.delete('/dates/:user/:date', auth, dateController.delete);

// Goals
router.get('/goals/:user', auth, goalController.index);
router.post('/goals/:user', auth, goalController.store);
router.put('/goals/:user/:goal', auth, goalController.update);
router.delete('/goals/:goal', auth, goalController.delete);

// Contacts
router.get('/contacts/:user', auth, contactController.index);
router.get('/contacts/:contact/notes', contactController.notes);
router.post('/contacts/:contact/notes', contactController.storeNote);
router.delete('/contacts/:contact/notes/:note', contactController.deleteNote);
router.post('/contacts/:user', auth, contactController.store);
router.put('/contacts/:user/:contact', auth, contactController.update);
router.delete('/contacts/:contact', auth, contactController.delete);

// Meal Plans
router.get('/meals/:user', auth, mealController.index);
router.post('/meals/:user', auth, mealController.store);
router.put('/meals/:user/:meal', auth, mealController.update);
router.delete('/meals/:user/:meal', auth, mealController.delete);

// Planning
router.get('/planning/:user', auth, planningController.index);
router.post('/planning/:user', auth, planningController.store);
router.put('/planning/:user/:plan', auth, planningController.update);
router.delete('/planning/:user/:plan', auth, planningController.delete);

module.exports = router;