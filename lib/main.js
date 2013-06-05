var socketio = require('socket.io');
var redis = require("redis");
var dbClient = redis.createClient();

var documentsNames = [];
var users = [];

var handleNewDocument = function (socket) {
    socket.on('CreateNewDocument', function (data) {
        if(documentsNames.indexOf(data.name) === -1){
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
        }
        else {
            socket.emit('documentAlreadyExist', {
                'name': data.name
            });
        }
    });
};
         //TODO historia
var handleGetAllDocumentsNames = function (socket) {
    socket.on('getDocumentsNames', function () {
        socket.emit('namesList', {
            'names': documentsNames
        });
    });
};

var handleNewUser = function (socket) {
    socket.on('CreateUserName', function (data) {
        if(users.indexOf(data.name) === -1) {
            users.push(data.name);
            socket.emit('userCreated', {
                'userName': data.name
            });
            socket.emit('usersList', {
                'users': users
            });
            socket.broadcast.emit('usersList', {
                'users': users
            });
        }
        else {
            socket.emit('userAlreadyExist', {
                'name': data.name
            });
        }
    });
};

var handleGetAllUsersNames = function (socket) {
    socket.on('getUserNames', function () {
        socket.emit('usersList', {
            'users': users
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
        handleNewUser(socket);
        handleGetAllUsersNames(socket);

    });
};