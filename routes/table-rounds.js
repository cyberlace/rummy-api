var express = require('express');
var router = express.Router();
var gameRoundController = require('../controllers/table-rounds');

var returnRouter = function(io, sockets) {
    router.route('/start/:game_table_id').get(gameRoundController.startRound(io, sockets));
    router.route('/get-info/:game_table_id').get(gameRoundController.getRoundInfo(io, sockets));

    return router;
};

module.exports = returnRouter;
