var express = require('express');
var router = express.Router();
var tableUserController = require('../controllers/table-users');

var returnRouter = function(io, sockets) {
    router.route('/').get(tableUserController.getAll(io, sockets));
    router.route('/:game_table_id').get(tableUserController.getByGameTableId(io, sockets));
    router.route('/').post(tableUserController.create(io, sockets));

    return router;
};

module.exports = returnRouter;
