$(document).ready(function() {
    var editor = ace.edit("editor");

    var currentDocumentName = $(location).attr('href').split("?")[1];

    sharejs.open(currentDocumentName, 'text', 'http://localhost:8000/channel', function (error, doc) {
        doc.attach_ace(editor);
    });
});