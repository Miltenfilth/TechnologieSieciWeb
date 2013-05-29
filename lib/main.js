var socketio = require('socket.io');

//przydała by się tablica obiektow
//konstruktor            dorobić
var Line = function (user) {
    this.text = "";
    this.blocked = false;
    this.user = user;
};

var text = [new Line(null)];

var handleLineChange = function (socket) {
    socket.on('lineChanged', function (data) {
        //zmien zawartosc w pamieci i bazie
        text[data.lineNumber] = data.text;
        //odeślij do reszty nowa linie
        socket.broadcast.to(data.documentId).emit('lineChanged', {
            lineNumber: data.lineNumber,
            text: data.text
        });
    });
};

var handleLineBlock = function (socket) {
    socket.on('lineBlock', function (data) {
        //jeśli to nie ja blokuje
        if(text[data.lineNumber].blocked && text[data.lineNumber].user !== data.user) {
            socket.emit('cannotBlockLine', {
                lineNumber: data.lineNumber
            });
        }
        else {
            text[data.lineNumber].blocked = true;
            text[data.lineNumber].user = data.user;
            //odeślij do reszty informacje o zablokowaniu
            socket.broadcast.to(data.documentId).emit('lineBlocked', {
                lineNumber: data.lineNumber
            });
        }
    });
};

var handleLineRelease = function (socket) {
    socket.on('lineReleased', function (data) {
        text[data.lineNumber].blocked = false;
        //odeślij do reszty informacje o odblokowaniu
        socket.broadcast.to(data.documentId).emit('lineReleased', {
            lineNumber: data.lineNumber
        });
    });
};

var handleNewLineInsert = function (socket) {
    socket.on('newLineInsert', function (data) {
        //stworz linie z konstruktora
        var newLine = new Line(data.user);
        for(var i = text.length - 1; i >= data.lineNumber; i--) {
            text[i + 1] = text[i];
        }
        text[data.lineNumber] = newLine;
        //odeślij do reszty nowa tablice?
        socket.broadcast.to(data.documentId).emit('newLineInsert', {
            changedDocument: text
        });
    });
};

var handleLineDelete = function (socket) {
    socket.on('LineDelete', function (data) {
        //usun z tablicy i przesun reszte
        for(var i = data.lineNumber; i < text.length; i++) {
            text[i] = text[i + 1];
        }
        text[text.length - 1] = null;
        //odeślij do reszty nowa tablice?
        socket.broadcast.to(data.documentId).emit('LineDelete', {
            changedDocument: text
        });
    });
};

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        //ustawienia poczatkowe


        //handlery
        handleLineBlock(socket);
        handleLineRelease(socket);
        handleLineChange(socket);
        handleLineDelete(socket);
        handleNewLineInsert(socket);


        handleClientDisconnection();
    });
};