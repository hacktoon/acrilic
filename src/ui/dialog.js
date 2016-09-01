
ac.export("dialog", function(env){
    "use strict";

    var dialog = {
        elem: (function(){
            var elem = $('#dialog-overlay');
            elem.find('.btn-close').on('click', function(){
                dialog.close();
            });

            ac.document.on('keydown', function(e){
                if (e.which == ac.keys.ESC){
                    dialog.close();
                }
            });
            return elem;
        })(),

        addButton: function(title, action){
            var id = 'btn-' + title.replace(/\s+/g, '-').toLowerCase();
            var btn = $('<button/>').attr('id', '#' + id).on('click', function(){
                action();
            }).html(title);
            this.elem.find('.dialog-button-panel').append(btn);
        },

        open: function(hook){
            this.elem.show();
            if(hook) {
                hook();
            }
        },

        close: function(){
            var children = '.dialog-content, .dialog-button-panel';
            this.elem.hide().find(children).html('');
        },

        init: function(title, templateSelector, hook) {
            var content = $(templateSelector).html();
            this.elem.find('.dialog-titlebar .title').html(title);
            this.elem.find('.dialog-content').html(content);
            if(hook) {
                hook();
            }
        }
    };

    var openNewFileDialog = function(action){
        dialog.init("New file", '#tpl-dialog-file-new', function(){
            var options = [];
            var tilesetSpecs = ac.data.tilesets;
            for(var i=0; i<tilesetSpecs.length; i++){
                var item = tilesetSpecs[i];
                var option = $("<option/>").val(item.id).html(item.name);
                options.push(option);
            }
            $('#field-file-new-tileset').append(options);
        });

        dialog.addButton('OK', function(){
            var name = $('#field-file-new-name').val(),
                cols = Number($('#field-file-new-width').val()),
                rows = Number($('#field-file-new-height').val()),
                tileset = $('#field-file-new-tileset').val();
            action(name, rows, cols, tileset);
            dialog.close();
        });

        dialog.addButton('Cancel', function(){
            dialog.close();
        });

        dialog.open();
    };

    var openImportDialog = function(action){
        var field;
        dialog.init("Import", '#tpl-dialog-file-import', function(){
            field = $('#field-file-import-map');
        });
        dialog.addButton('Import', function(){
            action(field.val());
            dialog.close();
        });
        dialog.addButton('Close', function(){
            dialog.close();
        });
        dialog.open(function(){
            field.focus();
        });
    };

    var openExportDialog = function(value){
        dialog.init("Export", '#tpl-dialog-file-export');
        dialog.addButton('Close', function(){
            dialog.close();
        });
        $("#field-file-export-map").focus().val(value);
        dialog.open();
    };

    return {
        openNewFileDialog: openNewFileDialog,
        openImportDialog: openImportDialog,
        openExportDialog: openExportDialog
    };
});
