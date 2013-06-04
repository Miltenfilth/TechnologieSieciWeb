var socket = io.connect();

var App = function (socket) {
    this.socket = socket;
};

App.prototype.createNewDocument = function (name) {
    this.socket.emit('CreateNewDocument', {
        'name': name
    });
};

App.prototype.getDocumentsNames = function () {
    this.socket.emit('getDocumentsNames');
};

$(document).ready(function () {
    var app = new App(socket);

    socket.on('namesList', function (result) {
        var documentListSelector = $('#documentsList');
        documentListSelector.empty();
        for (var i = 0; i < result.names.length; i++) {
            documentListSelector.append('<li><a href="/edit.html?id=' + result.names[i] + '">' + result.names[i] + '</a></li>')
        }
    });

    socket.on('documentAlreadyExist', function (result) {
        if (confirm('Document named: "' + result.name + '" already exist, do you want open it?')) {
            window.location.href = "/edit.html?id=" + result.name;
        }
    });

    $('#newButton').on('click', function () {
        var newDocumentName = $('#newDocumentName').val();
        app.createNewDocument(newDocumentName);
    });

    app.getDocumentsNames();

});