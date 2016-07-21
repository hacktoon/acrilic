
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

        open: function(){
            this.elem.show();
        },

        close: function(){
            var children = '.dialog-content, .dialog-button-panel';
            this.elem.hide().find(children).html('');
        },

        init: function(title, templateSelector) {
            var content = $(templateSelector).html();
            this.elem.find('.dialog-titlebar .title').html(title);
            this.elem.find('.dialog-content').html(content);
        }
    };

    var openNewMapDialog = function(){
        dialog.init("New map", '#tpl-dialog-file-new');
        dialog.addButton('OK', function(){
            var name = $('#field-file-new-name').val(),
                width = Number($('#field-file-new-width').val()),
                height = Number($('#field-file-new-height').val());
            dialog.close();
        });
        dialog.addButton('Cancel', function(){
            dialog.close();
        });
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
        openNewMapDialog: openNewMapDialog
    };
});
