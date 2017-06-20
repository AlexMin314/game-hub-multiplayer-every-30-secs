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
router.get('/:singlep', gameController.singleMainLogin); // for login user
router.get('/:multip', gameController.multiplay); // for login user
router.get('/:room', gameController.room); // game lounge
router.get('/game/get/rank', gameController.rank);
router.get('/game/get/score', gameController.getScore);
router.post('/game/post/score/:name/:score', gameController.postScore);


module.exports = router;
