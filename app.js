/*jshint node: true */
var express = require('express');
var http = require('http');
var path = require('path');
var less = require('less-middleware');


var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(less({
        src: __dirname + '/public',
        compress: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Serwer nasłuchuje na porcie " + app.get('port'));
});

var chatServer = require('./lib/main');
chatServer.listen(server);

