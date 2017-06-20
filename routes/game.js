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


router.get('/single', gameController.singleMain); // for guest
router.get('/room/:room', gameController.room); // game lounge
router.get('/singlep/:room', gameController.singleMainLogin); // for login user
router.get('/multip/:room', gameController.multiplay); // for login user
router.get('/game/rank', gameController.rank);
router.get('/game/get/score', gameController.getScore);
router.post('/game/post/score/:name/:score', gameController.postScore);


module.exports = router;
