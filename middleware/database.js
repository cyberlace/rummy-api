var mysql = require("mysql");

// First you need to create a connection to the db
var connection = mysql.createConnection({
    host: "localhost",
    user: "rummy",
    password: "Z2J1Sbq7zbXiztBy",
    database: "rummy"
});

module.exports = {
    connect: function () {
        connection.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db' + err);
                return;
            }
            console.log('DB Connection established');
            return connection;
        });
    },
    end: function () {
        connection.end(function (err) {
            if (err) {
                console.log('Error Disconnecting Db' + err);
                return;
            }
            console.log('DB connection end');
        });
    },
    query: function (query) {
        return new Promise(function (resolve, reject) {
            connection.query(query, function (err, rows) {
                if (err) {
                    console.log('Error Execution Query: ' + query + '\n' + err);
                    reject(err);
                }
                console.log('Query executed: ' + query);
                resolve(rows);
            });
        });
    },
    insert: function (query, data) {
        return new Promise(function (resolve, reject) {
            connection.query(query, data, function (err, rows) {
                if (err) {
                    console.log('Error Execution Query: ' + query + '\n' + err);
                    reject(err);
                }
                console.log('Query executed: ' + query + JSON.stringify(data));
                resolve(rows);
            });
        });
    }
};
