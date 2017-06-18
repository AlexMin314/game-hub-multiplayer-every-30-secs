const express = require('express');
const session = require('express-session');
const passport = require('passport');

const router = express.Router();

/**
 * Controllers, configs
 */
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const contactController = require('../controllers/contact');


router.get('/', homeController.index);
router.get('/logout', userController.logout);

module.exports = router;
