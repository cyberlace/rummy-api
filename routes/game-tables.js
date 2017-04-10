var express = require('express');
var router = express.Router();
var gameTableController = require('../controllers/game-tables');

router.route('/').get(gameTableController.getAll);
router.route('/').post(gameTableController.create);

module.exports = router;
