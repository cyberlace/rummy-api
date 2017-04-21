var db = require('../middleware/database.js');
var _ = require('underscore');

var tableName = 'game_tables';

module.exports = {
    getAll: function (success, failure) {
        console.log("in model");
        db.query('Select t.*, u.first_name as user_first_name from ' + tableName + ' t, users u where t.user_id = u.id').then(function (data) {
            success(data);
        }, function (err) {
            failure(err);
        });
    },
    getById: function (id, success, failure) {
        db.query('Select t.*, u.first_name as user_first_name from ' + tableName + ' t, users u where t.user_id = u.id and t.id ="' + id + '"').then(function (data) {
            success(data[0]);
        }, function (err) {
            failure(err);
        });
    },
    create: function (body, success, failure) {
        const data = _.pick(body, 'user_id', 'table_type', 'game_type', 'bet', 'max_players');
        //console.log(data);
        db.query('Select * from ' + tableName + ' where user_id = "' + data.user_id + '" and status = "Waiting" and game_type = "' + data.game_type + '"').then(function (result) {
            if (result.length) {
                failure({"message": "There is already a game table in waiting status."});
            } else {
                db.insert('INSERT INTO ' + tableName + ' SET ?', data).then(function (result) {
                    // console.log(JSON.stringify(data) + data.insertId);
                    if (result.insertId) {
                        success({"message": "Game Table Inserted Successfully"});
                    } else {
                        failure({"message": "Game Table Insertion Failed"});
                    }
                }, function (err) {
                    failure(err);
                });
            }
        }, function (err) {
            failure(err);
        });

    }
};
