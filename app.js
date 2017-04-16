var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var key = '6e63c90e48214d4fc3ccb55db86da490';
var encryptor = require('simple-encryptor')(key);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    var origin = req.headers.origin;
    var allowedOrigins = [
        'http://127.0.0.1:4201',
        'http://localhost:4201',
        'http://rummy.cyberlace.com:4201',
        'http://rummy.cyberlace.com'
    ];
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Authentication
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        var token = bearer[1];

        req.current_user_id = encryptor.decrypt(token);
    }
    // Pass to next layer of middleware
    next();
});

// Add users to Socket
var sockets = {};
io.on('connection', function (socket) {
    var io_current_user_id = socket.handshake.query['current_user_id'];
    sockets[io_current_user_id] = socket;
    console.log('User connected: ' + io_current_user_id + ' - '+ socket.id);

    socket.on('disconnect', function () {
        console.log('User disconnected: ' + io_current_user_id + ' - '+ socket.id);
    });
});

// Add Routers
app.get('/', function (req, res) {
    res.send('Hello World!');
});

var usersRoute = require('./routes/users');
app.use('/user', usersRoute);

var gameTablesRoute = require('./routes/game-tables')(io, sockets);
app.use('/game-table', gameTablesRoute);

var tableUsersRoute = require('./routes/table-users')(io, sockets);
app.use('/table-user', tableUsersRoute);

http.listen(process.env.PORT || 5000, function () {
    console.log("Server Started");
});
