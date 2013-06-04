var socket = io.connect();

var App = function (socket) {
    this.socket = socket;
};

App.prototype.getDocumentsNames = function () {
    this.socket.emit('getDocumentsNames');
};

$(document).ready(function () {
    var app = new App(socket);

    var editor = ace.edit("editor");

    var currentDocumentName = $(location).attr('href').split("?")[1];

    sharejs.open(currentDocumentName, 'text', 'http://localhost:8000/channel', function (error, doc) {
        doc.attach_ace(editor);
    });

    socket.on('namesList', function (result) {
        var documentListSelector = $('#documentsList');
        documentListSelector.empty();
        for (var i = 0; i < result.names.length; i++) {
            documentListSelector.append('<li><a href="/edit.html?id=' + result.names[i] + '">' + result.names[i] + '</a></li>')
        }
    });

    $('#newButton').on('click', function () {
        var newDocumentName = $('#newDocumentName').val();
        app.createNewDocument(newDocumentName);
    });

    app.getDocumentsNames();
});
