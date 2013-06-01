var socketio = require('socket.io');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

var Document = mongoose.Schema({
    'name': String,
    'lines': [{
        'text': String,
        'blocked': Boolean,
        'user': String
    }]
});

var DocumentModel = db.model('Document', Document);

var documents = [];

var Line = function () {
    this.text = "";
    this.blocked = false;
    this.user = "";
};

var handleNewDocument = function (socket) {
    socket.on('newDocumentCreate', function (data) {
        var document = new DocumentModel();
        document.name = "data.name";
        document.lines[0] = new Line();
        document.lines[1] = new Line();
        document.lines[2] = new Line();
        var newDocumentId = documents.push(document);
        socket.emit('documentCreated', {
            'document': document,
            'documentId': newDocumentId
        });
    });
};

var handleGetAllDocumentsNames = function(socket) {
    socket.on('getDocumentsNames', function (data) {
        var names = [];
        for (var i = 0; i < documents.length; i++) {
            names.push({
                'name': documents[i].name,
                'id': i
            });
        }
        socket.emit('namesList', {
            'names': names
        });
    });
};

var handleLineChange = function (socket) {
    socket.on('lineChanged', function (data) {
        documents[data.documentId].lines[data.lineNumber].text = data.text;
        socket.broadcast.to(data.documentId).emit('lineChanged', {
            'documentId': documentId,
            'lineNumber': data.lineNumber,
            'text': data.text
        });
        //documents[i].lines[data.lineNumber].save(function (err, item) {
        //    console.log(item);
        //});
    });
};

var handleLineBlock = function (socket) {
    socket.on('lineBlock', function (data) {
        var document = documents[data.documentId];
        if(document.lines[data.lineNumber].blocked && document.lines[data.lineNumber].user !== data.user) {
            socket.emit('cannotBlockLine', {
               'documentId': data.documentId,
                'lineNumber': data.lineNumber
            });
        }
        else {
            document.lines[data.lineNumber].blocked = true;
            document.lines[data.lineNumber].user = data.user;
            //odeślij do reszty informacje o zablokowaniu
            socket.broadcast.to(data.documentId).emit('lineBlocked', {
                'documentId': data.documentId,
                'lineNumber': data.lineNumber
            });
            documents[data.documentId] = document;
        }
    });
};

var handleLineRelease = function (socket) {
    socket.on('lineReleased', function (data) {
        var document = documents[data.documentId];
        if(document.lines[data.lineNumber].blocked && document.lines[data.lineNumber].user === data.user) {
            document.lines[data.lineNumber].blocked = false;
            socket.broadcast.to(data.documentId).emit('lineReleased', {
                'documentId': data.documentId,
                'lineNumber': data.lineNumber
            });
        }//else nie mozna odblokowac
    });
};

var handleNewLineInsert = function (socket) {
    socket.on('newLineInsert', function (data) {
        //stworz linie z konstruktora
        var newLine = new Line();
        var document = documents[data.documentId];
        for(var i = document.lines.length - 1; i >= data.lineNumber; i--) {
            document.lines[i + 1] = document.lines[i];
        }
        document.lines[data.lineNumber] = newLine;
        //odeślij do reszty nowa tablice?
        socket.broadcast.to(data.documentId).emit('newLineInsert', {
            'documentId': data.documentId,
            'changedDocument': document
        });
        documents[data.documentId] = document;
    });
};

var handleLineDelete = function (socket) {
    socket.on('LineDelete', function (data) {
        var document = documents[data.documentId];
        //usun z tablicy i przesun reszte
        for(var i = data.lineNumber; i < document.lines.length; i++) {
            document.lines[i] = document.lines[i + 1];
        }
        document.lines[document.lines.length - 1] = "";
        document.lines.length=document.lines.length - 1;
        //odeślij do reszty nowa tablice?
        socket.broadcast.to(data.documentId).emit('LineDelete', {
            'documentId': data.documentId,
            'changedDocument': document
        });
        documents[data.documentId] = document;
    });
};

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        //ustawienia poczatkowe


        //handlery
        handleNewDocument(socket);
        handleGetAllDocumentsNames(socket);
        handleLineBlock(socket);
        handleLineRelease(socket);
        handleLineChange(socket);
        handleLineDelete(socket);
        handleNewLineInsert(socket);


        handleClientDisconnection();
    });
};