var db = require('../middleware/database.js');
var _ = require('underscore');

var tableName = 'table_users';

module.exports = {
    getAll: function (success, failure) {
        db.query('Select t.*, u.first_name as user_first_name from ' + tableName + ' t, users u where t.user_id = u.id').then(function (data) {
            success(data);
        }, function (err) {
            failure(err);
        });
    },
    getByGameTableId: function (gameTableId, success, failure) {
        db.query('Select t.*, u.first_name as user_first_name from ' + tableName + ' t, users u where t.user_id = u.id and t.game_table_id ="' + gameTableId + '"').then(function (data) {
            success(data);
        }, function (err) {
            failure(err);
        });
    },
    create: function (body, success, failure) {
        const data = _.pick(body, 'user_id', 'game_table_id');
        //console.log(data);
        db.query('Select * from ' + tableName + ' where user_id = "' + data.user_id + '" and game_table_id = "' + data.game_table_id + '"').then(function (result) {
            if (result.length) {
                failure({"message": "You already joined in this game table."});
            } else {
                db.insert('INSERT INTO ' + tableName + ' SET ?', data).then(function (result) {
                    // console.log(JSON.stringify(data) + data.insertId);
                    if (result.insertId) {
                        success({"message": "Table User Inserted Successfully"});
                    } else {
                        failure({"message": "Table User Insertion Failed"});
                    }
                }, function (err) {
                    failure(err);
                });
            }
        });

    }
};
