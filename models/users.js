var db = require('../middleware/database.js');

module.exports = {
    getAll: function (success, failure) {
        db.query('Select * from users;').then(function (data) {
            success(data);
        }, function (err) {
            failure(err);
        });
    },
    login: function (body, success, failure) {
        db.query('Select * from users where email = "' + body.email + '" and password = "' + body.password + '";').then(function (data) {
            // console.log(JSON.stringify(data) + data.length);
            if (data.length == 1) {
                success({
                    "token": "qwerty-asdfg-12345",
                    "id": data[0].id,
                    "firstName": data[0].first_name,
                    "lastName": data[0].last_name,
                    "email": data[0].email
                });
            } else {
                failure({"message": "Invalid Credentials"});
            }
        }, function (err) {
            failure(err);
        });
    },
    signup: function (body, success, failure) {
        db.query('Select * from users where email = "' + body.email + '";').then(function (data) {
            if (data.length) {
                failure({"message": "Email already registered"});
            } else {
                db.insert('INSERT INTO users SET ?', body).then(function (data) {
                    // console.log(JSON.stringify(data) + data.insertId);
                    if (data.insertId) {
                        success({"message": "Registered Successfully"});
                    } else {
                        failure({"message": "Registration Failed"});
                    }
                }, function (err) {
                    failure(err);
                });
            }
        });
    }
};


