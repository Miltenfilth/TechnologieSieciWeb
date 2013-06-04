var socketio = require('socket.io');
var redis = require("redis");
var dbClient = redis.createClient();

var documentsNames = [];

//TODO unikalne nazwy dokumentow
var handleNewDocument = function (socket) {
    socket.on('CreateNewDocument', function (data) {

        documentsNames.push(data.name);
        socket.emit('documentCreated', {
            'documentName': data.name
        });
        socket.broadcast.emit('namesList', {
            'names': documentsNames
        });
        socket.emit('namesList', {
            'names': documentsNames
        });
        dbClient.sadd("documentsNames", data.name);
    });
};

var handleGetAllDocumentsNames = function (socket) {
    socket.on('getDocumentsNames', function () {
        socket.emit('namesList', {
            'names': documentsNames
        });
    });
};

exports.listen = function (server) {
    var io = socketio.listen(server);

    dbClient.smembers("documentsNames", function (err, reply) {
        documentsNames = reply;
    });

    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        //ustawienia poczatkowe

        //handlery
        handleNewDocument(socket);
        handleGetAllDocumentsNames(socket);

    });
};