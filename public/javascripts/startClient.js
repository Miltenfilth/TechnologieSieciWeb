var socket = io.connect();

var App = function (socket) {
    this.socket = socket;
};

App.prototype.createNewDocument = function (name) {
    this.socket.emit('CreateNewDocument', {
        'name': name
    });
};

App.prototype.getDocumentsNames = function (name) {
    this.socket.emit('getDocumentsNames');
};

$(document).ready(function () {
    var app = new App(socket);
    var workMode = "start";

    socket.on('namesList', function(result) {
        $('#documentsList').empty();
       for(var i = 0; i < result.names.length; i++) {
           $('#documentsList').append('<li><a href="/edit/' + result.names[i].id + '">' + result.names[i].name + '</a></li>')
       }
    });

    $('#newButton').on('click', function() {
        var newDocumentName = $('#newDocumentName').val();
        app.createNewDocument(newDocumentName);
        //alert(newDocumentName);
    });

    app.getDocumentsNames();

});