var socket2 = io.connect();

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
    var app = new App(socket2);

    var editor = ace.edit("editor");

    var currentDocumentName = $(location).attr('href').split("?")[1];

    sharejs.open(currentDocumentName, 'text', 'http://localhost:8000/channel', function (error, doc) {
        doc.attach_ace(editor);
    });


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
                $('#textTable').append('<tr><td><input type="text" name="input' + i + '" value="' + document.lines[i].text + '" ></td><td><input type="checkbox" id="blocker' + i + '" /></td></tr>');
            }
            else {
                $('#textTable').append('<tr><td><input type="text" name="input' + i + '" value="' + document.lines[i].text + '" disabled></td><td><input type="checkbox" id="blocker' + i + '" disabled checked="checked" /></td></tr>');
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