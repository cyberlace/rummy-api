var tableUsersModel = require('../models/table-users');

exports.getAll = function (io, sockets) {
    return function (req, res) {
        tableUsersModel.getAll(
            function (data) {
                data.forEach(function(tableUser) {
                    if(tableUser.user_id === req.current_user_id) {
                        var room = 'GAME_TABLE_' + tableUser.game_table_id;
                        sockets[tableUser.user_id].join(room);
                    }
                });
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        )
    }
};

exports.getByGameTableId = function (io, sockets) {
    return function (req, res) {
        tableUsersModel.getByGameTableId(
            req.params.game_table_id,
            function (data) {
                data.forEach(function(tableUser) {
                    if(tableUser.user_id === req.current_user_id) {
                        var room = 'GAME_TABLE_' + tableUser.game_table_id;
                        sockets[tableUser.user_id].join(room);
                    }
                });
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        )
    }
};

exports.create = function (io, sockets) {
    return function (req, res) {
        // console.log(req.body);
        if (typeof req.body.user_id === 'number'
            && typeof req.body.game_table_id === 'number') {
            tableUsersModel.create(
                req.body,
                function (data) {
                    var user_id = req.body.user_id;
                    var game_table_id = req.body.game_table_id;
                    var room = 'GAME_TABLE_' + game_table_id;
                    sockets[user_id].join(room);
                    io.to(room).emit('table-users-updated', {});
                    res.status(200).json(data);
                },
                function (err) {
                    res.status(400).json(err);
                }
            )
        } else {
            res.status(400).json({"message": "Invalid Data", "status": "failed"})
        }
    }
};
