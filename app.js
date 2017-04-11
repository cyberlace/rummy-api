var express = require('express');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    var allowedOrigins = ['http://127.0.0.1:4201', 'http://localhost:4201', 'http://rummy.cyberlace.com:4201', 'http://rummy.cyberlace.com'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

// Add Routers
app.get('/', function (req, res) {
    res.send('Hello World!');
});

var usersRoute = require('./routes/users');
app.use('/user', usersRoute);

var gameTablesRoute = require('./routes/game-tables');
app.use('/game-table', gameTablesRoute);



app.listen(process.env.PORT || 3001);
