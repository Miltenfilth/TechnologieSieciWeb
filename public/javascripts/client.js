var socket = io.connect();

var App = function (socket) {
    this.socket = socket;
};
/*
 App.prototype.changeLine = function(room) {
 this.socket.emit('lineChanged', {
 newRoom: room
 });
 };
 */
App.prototype.createNewDocument = function (name) {
    this.socket.emit('CreateNewDocument', {
        'name': name
    });
};

$(document).ready(function () {
    var app = new App(socket);

    app.createNewDocument('moj pierwszy dokument');


    socket.on('documentCreated', function (result) {
        var document = result.document;
        var documentId = result.documentId;

        $('#documentName').text('Nazwa dokumentu: ' + document.name);
        $('#documentId').text('Id dokumentu: ' + documentId);
        for (var i = 0; i < document.lines.length; i++) {
            if (!document.lines[i].blocked) {
                $('#textTable').append('<tr><td>bla:' + document.lines[i].text + '</td></tr>');
            }
            else {
                $('#textTable').append('<tr><td><input type="text" name="input' + i + '" value="' + document.lines[i].text + '"></td></tr>');
            }
        }
    });
    /*
     socket.on('nameResult', function(result) {
     var message;

     if (result.success) {
     message = 'You are now known as ' + result.name + '.';
     } else {
     message = result.message;
     }
     $('#messages').append(divSystemContentElement(message));
     });

     socket.on('joinResult', function(result) {
     $('#room').text(result.room);
     $('#messages').append(divSystemContentElement('Room changed.'));
     });

     socket.on('message', function (message) {
     var newElement = $('<div></div>').text(message.text);
     $('#messages').append(newElement);
     });

     socket.on('rooms', function(rooms) {
     $('#room-list').empty();

     for(var room in rooms) {
     room = room.substring(1, room.length);
     if (room != '') {
     $('#room-list').append(divEscapedContentElement(room));
     }
     }

     $('#room-list div').click(function() {
     chatApp.processCommand('/join ' + $(this).text());
     $('#send-message').focus();
     });
     });

     setInterval(function() {
     socket.emit('rooms');
     }, 1000);

     $('#send-message').focus();

     $('#send-form').submit(function() {
     processUserInput(chatApp, socket);
     return false;
     });
     */
});