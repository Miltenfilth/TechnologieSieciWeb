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

App.prototype.createNewUser = function (name) {
    this.socket.emit('CreateUserName', {
        'name': name
    });
};

App.prototype.getUserNames = function () {
    this.socket.emit('getUserNames');
};

$(document).ready(function () {
    var app = new App(socket);

    socket.on('namesList', function (result) {
        var documentListSelector = $('#documentsList');
        documentListSelector.empty();
        documentListSelector.append('<li>We have currently: ' + result.names.length + ' documents!</li>');
        for (var i = 0; i < result.names.length; i++) {
            documentListSelector.append('<li><a href="/edit.html?id=' + result.names[i] + '">' + result.names[i] + '</a></li>');
        }
    });

 /*   socket.on('usersList', function (result) {
        var documentListSelector = $('#usersList');
        documentListSelector.empty();
        documentListSelector.append('<li>We have currently: ' + result.users.length + ' users!</li>');
        for (var i = 0; i < result.users.length; i++) {
            documentListSelector.append('<li>' + result.users[i] + '</li>');
        }
    });*/

    socket.on('documentAlreadyExist', function (result) {
        if (confirm('Document named: "' + result.name + '" already exist, do you want open it?')) {
            window.location.href = "/edit.html?id=" + result.name;
        }
    });

    socket.on('userAlreadyExist', function (result) {
        Alert('User: "' + result.name + '" already exists! Please chose different name');
    });

    $('#newButton').on('click', function () {
        var newDocumentName = $('#newDocumentName').val();
        app.createNewDocument(newDocumentName);
    });

    $('#newUserButton').on('click', function () {
        var newUserName = $('#newUserName').val();
        app.createNewUser(newUserName);
    });

    app.getDocumentsNames();
    app.getUserNames();

});