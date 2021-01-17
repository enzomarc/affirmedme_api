const express = require('express');
const web = express.Router();

// Controllers
const authController = require('../controllers/webAuthController');
const moduleController = require('../controllers/moduleController');
const tipController = require('../controllers/tipController');
const audioController = require('../controllers/audioController');


// Middlewares
const auth = require('../middlewares/auth_web');

// Authentication
web.get('/login', authController.page);
web.get('/logout', authController.logout);
web.post('/login/:token', authController.login);

web.get('/', auth, (req, res, next) => {
  res.render('index', { layout: 'main', title: 'Dashboard' });
});

// Modules
web.get('/modules', auth, moduleController.page);
web.get('/modules/create', auth, moduleController.create);
web.get('/modules/edit/:module', auth, moduleController.edit);

web.get('/tips', auth, tipController.page);
web.get('/audios', audioController.page);

module.exports = web;