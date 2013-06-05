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

    var currentDocumentName = $(location).attr('href').split("=")[1];

    var docGlobal;

    sharejs.open(currentDocumentName, 'text', 'http://localhost:8000/channel', function (error, doc) {
        doc.attach_ace(editor);
        docGlobal = doc;
    });

    socket.on('namesList', function (result) {
        var documentListSelector = $('#documentsList');
        documentListSelector.empty();
        for (var i = 0; i < result.names.length; i++) {
            documentListSelector.append('<li><a href="/edit.html?id=' + result.names[i] + '">' + result.names[i] + '</a></li>')
        }
    });

    $('#titleText').text(currentDocumentName.split("%20").join(' '));

    app.getDocumentsNames();

  /* for(var i = 0; i < editor.session.getLength(); i++) {
        $('#editorSide').append('<button id="block' + i + '" >Block Line</button>');
    }
    */
    var lineBlocked = 3;

    editor.getSession().selection.on('changeCursor',  function () {
        var cursor = editor.selection.getCursor();
        $('#label').html(cursor.row);
        if(cursor.row === lineBlocked) {
            $('#block').focus();
        }

    });



  /*  editor.on('click',  function () {
        var cursor = editor.selection.getCursor();
        $('#label').html(cursor.row);
        if(cursor.row === lineBlocked) {
            $('#block').focus();
        }
    });  */
    //TODO dziala ale trzeba dodac delete i backspace
    /*
    editor.container.addEventListener("keydown", function (event) {
        var cursor = editor.selection.getCursor();
        if(cursor.row === 3)
            event.preventDefault();
    }, true);
     */


    $('#block').on('click', function () {
        if(lineBlocked === 3) {
            lineBlocked = null;
            $('#block').css('border-style', 'none');
        }
        else {
            lineBlocked = 3;
            $('#block').css('border-style', 'inset');
        }
    });

    $('#save').on('click', function () {
        var lines = editor.getSession().getDocument().getAllLines();
        var text = '';
        for(var x=0;x<lines.length;x++){
            text += lines[x] + '\r\n';
        }
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, currentDocumentName + ".txt");
    });


    //TODO spowolnic i ustawic
    $('#play').on('click', function () {
        var text = docGlobal.getText();
        speak(text);
    });
});
