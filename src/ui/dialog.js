
ac.export("dialog", function(env){
    "use strict";

    var dialog = {
        elem: (function(){
            var elem = $('#dialog-overlay');
            elem.find('.btn-close').on('click', function(){
                dialog.close();
            });

            $(document).on('keydown', function(e){
                if (e.which == ac.ESC_KEY){
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

    var openNewMapDialog = function(action){
        dialog.init("New map", '#tpl-dialog-file-new');
        dialog.addButton('OK', function(){
            var name = $('#field-file-new-name').val(),
                horz_tiles = Number($('#field-file-new-width').val()),
                vert_tiles = Number($('#field-file-new-height').val());
            action(name, horz_tiles, vert_tiles);
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

    var createConfirmDialog = function(message, action){
        /*var self = this;
        this.open('', '<p>' + message + '</p>', [
            {title: 'OK', action: function(){
                action();
                self.close();
            }},
            {title: 'Cancel', action: function(){
                self.close();
            }}
        ]);*/
    };


    return {
        openNewMapDialog: openNewMapDialog,
        openImportDialog: openImportDialog,
        openExportDialog: openExportDialog
    };
});
