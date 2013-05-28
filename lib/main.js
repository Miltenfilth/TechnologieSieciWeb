var socketio = require('socket.io');

//przydała by się tablica obiektow
//konstruktor            dorobić
var Line = function() {
    this.text = "";
    this.blocked = false;
}

var text = [""];

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
}

var handleLineBlock = function (socket) {
    socket.on('lineBlock', function (data) {
        //jeśli to nie ja blokuje
        if(text[data.lineNumber].blocked) {
            socket.emit('cannotBlockLine', {
                lineNumber: data.lineNumber
            });
        }
        else {
            text[data.lineNumber].blocked = true;
            //odeślij do reszty informacje o zablokowaniu
            socket.broadcast.to(data.documentId).emit('lineBlocked', {
                lineNumber: data.lineNumber
            });
        }
    });
}

var handleLineRelease = function (socket) {
    socket.on('lineReleased', function (data) {
        text[data.lineNumber].blocked = false;
        //odeślij do reszty informacje o odblokowaniu
        socket.broadcast.to(data.documentId).emit('lineReleased', {
            lineNumber: data.lineNumber
        });
    });
}

var handleNewLineInsert = function (socket) {
    socket.on('newLineInsert', function (data) {
        var newLine = new Line();
        //stworz linie z konstruktora
        //wstaw do tablicy i przesun reszte
        //odeślij do reszty nowa tablice?
        socket.broadcast.to(data.documentId).emit('newLineInsert', {
            newDocument: text
        });
    });
}

var handleLineDelete = function (socket) {
    socket.on('LineDelete', function (data) {
        //usun z tablicy i przesun reszte
        //odeślij do reszty nowa tablice?
        socket.broadcast.to(data.documentId).emit('LineDelete', {
            newDocument: text
        });
    });
}

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