var connect = require('./node_modules/connect');
var sharejs = require('./node_modules/share').server;
var socketio = require('socket.io');
var http = require('http');

var server = connect(
    connect.logger(),
    connect.static(__dirname + '/public')
);

var options = {db:{type:'redis'}};

sharejs.attach(server, options);

var httpServer = http.createServer(server);

httpServer.listen(8000, function () {
    console.log('Server running at http://127.0.0.1:8000/');
});

var MainServer = require('./lib/main');
MainServer.listen(httpServer);