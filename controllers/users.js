var userModel = require('../models/users');

exports.getUsers = function (req, res) {
    userModel.getAll(
        function (data) {
            res.status(200).json(data);
        },
        function (err) {
            res.status(400).json(err);
        }
    )
};

exports.login = function (req, res) {
    if (typeof req.body.email === 'string' && typeof req.body.password === 'string') {
        userModel.login(
            req.body,
            function (data) {
                res.status(200).json(data);
            },
            function (err) {
                res.status(401).json(err);
            }
        )
    } else {
        res.status(400).json({"message": "Invalid Request", "status" : "failed"})
    }
};

exports.signup = function (req, res) {
    if (typeof req.body.email === 'string' && typeof req.body.password === 'string') {
        userModel.signup(
            req.body,
            function (data) {
                res.status(200).json(data);
            },
            function (err) {
                res.status(400).json(err);
            }
        )
    } else {
        res.status(400).json({"message": "Invalid Credentials", "status" : "failed"})
    }
};

