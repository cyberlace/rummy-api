var gameTableModel = require('../models/game-tables');

exports.getAll = function (req, res) {
    gameTableModel.getAll(
        function (data) {
            res.status(200).json(data);
        },
        function (err) {
            res.status(400).json(err);
        }
    )
};

exports.create = function (req, res) {
    console.log(req.body);
    if (typeof req.body.user_id === 'number'
        && typeof req.body.max_players === 'number'
        && typeof req.body.bet === 'number') {
        gameTableModel.create(
            req.body,
            function (data) {
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        )
    } else {
        res.status(400).json({"message": "Invalid Data", "status": "failed"})
    }
};
