const express = require('express');
const web = express.Router();

// Controllers
const authController = require('../controllers/webAuthController');
const moduleController = require('../controllers/moduleController');
const tipController = require('../controllers/tipController');
const audioController = require('../controllers/audioController');


// Middlewares
const authMiddleware = require('../middlewares/auth_web');

// Authentication
web.get('/login', authController.page);
web.get('/logout', authController.logout);
web.post('/login/:token', authController.login);

web.get('/', authMiddleware, (req, res, next) => {
  res.render('index', { layout: 'main', title: 'Dashboard' });
});

web.get('/modules', authMiddleware, moduleController.page);
web.get('/tips', authMiddleware, tipController.page);
web.get('/audios', authMiddleware, audioController.page);

module.exports = web;