var express = require('express');
var router = express.Router();
var gameTableController = require('../controllers/game-tables');

var returnRouter = function(io, sockets) {
    router.route('/').get(gameTableController.getAll(io, sockets));
    router.route('/:id').get(gameTableController.getById(io, sockets));
    router.route('/').post(gameTableController.create(io, sockets));

    return router;
};

module.exports = returnRouter;
