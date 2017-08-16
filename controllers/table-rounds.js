var gameRoundModel = require('../models/table-rounds');
var _ = require('underscore');

exports.startRound = function (io, sockets) {
    return function (req, res) {
        gameRoundModel.startRound(
            req.params.game_table_id,
            req.current_user_id,
            function (data) {
                var room = 'GAME_TABLE_' + req.params.game_table_id;
                sockets[req.current_user_id].join(room);
                res.status(200).json(_.pick(data, 'message', 'roundState'));
            },
            function (err) {
                res.status(400).json(err);
            },
            function (data) {
                console.log("round created");
                var room = 'GAME_TABLE_' + req.params.game_table_id;
                io.to(room).emit('table-round-updated', {});
            }
        );
    }
};

exports.getRoundInfo = function (io, sockets) {
    return function (req, res) {
        gameRoundModel.getRoundInfo(
            req.params.game_table_id,
            req.current_user_id,
            function (data) {
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        );
    }
};

exports.pickOpenCard = function(io, sockets) {
    return function (req, res) {
        gameRoundModel.pickOpenCard(
            req.params.game_table_id,
            req.current_user_id,
            function (data) {
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        );
    }
};

exports.pickClosedCard = function(io, sockets) {
    return function (req, res) {
        gameRoundModel.pickClosedCard(
            req.params.game_table_id,
            req.current_user_id,
            function (data) {
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        );
    }
};

exports.dropCard = function(io, sockets) {
    return function (req, res) {
        gameRoundModel.dropCard(
            req.params.game_table_id,
            req.current_user_id,
            req.params.card,
            function (data) {
                var room = 'GAME_TABLE_' + req.params.game_table_id;
                io.to(room).emit('table-round-updated', {});
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        );
    }
};
