var express = require('express');
var router = express.Router();
var userController = require('../controllers/users');

router.route('/').get(userController.getUsers);
router.route('/login').post(userController.login);
router.route('/signup').post(userController.signup);


module.exports = router;
