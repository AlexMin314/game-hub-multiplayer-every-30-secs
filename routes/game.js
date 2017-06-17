const express = require('express');
const session = require('express-session');

const router = express.Router();

/**
 * Controllers, configs
 */
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const contactController = require('../controllers/contact');
const gameController = require('../controllers/game');


router.get('/single', gameController.singleMain);

module.exports = router;
