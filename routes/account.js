const express = require('express');
const session = require('express-session');
const passport = require('passport');

const router = express.Router();

/**
 * Controllers, configs
 */
const userController = require('../controllers/user');
const passportConfig = require('../config/passport');

router.get('/', passportConfig.isAuthenticated, userController.getAccount);
router.post('/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post('/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);

module.exports = router;
