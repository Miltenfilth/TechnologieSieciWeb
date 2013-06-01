var socket = io.connect();

var App = function (socket) {
    this.socket = socket;
};

App.prototype.getDocumentsNames = function (name) {
    this.socket.emit('getDocumentsNames');
};

App.prototype.getDocument = function(id) {
    this.socket.emit('getDocument', {
        'documentId': id
    })
};

$(document).ready(function () {
    var app = new App(socket);


    var currentDocumentId = $(location).attr('href').split("=")[1];
    var workMode = "edit";

    app.getDocumentsNames();
    app.getDocument(currentDocumentId);

    socket.on('documentContent', function (result) {
        var document = result.document;
        var documentId = result.documentId;

        $('#documentName').text('Nazwa dokumentu: ' + document.name);
        $('#documentId').text('Id dokumentu: ' + documentId);
        for (var i = 0; i < document.lines.length; i++) {
            if (!document.lines[i].blocked) {
                $('#textTable').append('<tr><td>' + document.lines[i].text + '</td></tr>');
            }
            else {
                $('#textTable').append('<tr><td><input type="text" name="input' + i + '" value="' + document.lines[i].text + '"></td></tr>');
            }
        }
    });

    socket.on('namesList', function(result) {
        $('#documentsList').empty();
        for(var i = 0; i < result.names.length; i++) {
            $('#documentsList').append('<li><a href="/edit.html?id=' + result.names[i].id + '">' + result.names[i].name + '</a></li>')
        }
    });

});