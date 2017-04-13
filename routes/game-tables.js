var express = require('express');
var router = express.Router();
var gameTableController = require('../controllers/game-tables');

var returnRouter = function(io) {
    router.route('/').get(gameTableController.getAll(io));
    router.route('/').post(gameTableController.create(io));

    return router;
};

module.exports = returnRouter;
