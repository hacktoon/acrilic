
ac.export("dialog", function(env){
    "use strict";

    var $dom = ac.import("dom"),
        $widget = ac.import("widget");

    function Dialog(title){
        (function init(){
            this.elem = undefined;
            this.title = title;
        }.bind(this))();

        this.open = function(){
            this.elem.show();
        };

        this.close = function(){
            this.elem.hide();
        };
    };

    var buildDialogButtons = function(dialog, buttonSet){
        var output = '';
        var setButtonAction = function(btn, id){
            dialog.elem.on('click', '#' + id, function(){
                btn.action(dialog);
            });
        };
        for (var i=0; i<buttonSet.length; i++){
            var btn = buttonSet[i],
                id = 'btn-' + btn.title.replace(/\s+/g, '-').toLowerCase();
            output += '<button id="' + id + '">' + btn.title + '</button>';
            setButtonAction(btn, id);
        }
        return output;
    };
/*
    var openModalDialog = function(title, content, buttonSet){
        var dialog = new Dialog(title);
        dialog.elem = $($('#tpl-dialog-overlay').html());
        elem.find('.btn-close').on('click', function(){
            dialog.close();
        });
        elem.find('.dialog-titlebar .title').html(title);
        elem.find('.dialog-content').html(content);
        elem.find('.dialog-button-panel').html(buildDialogButtons(dialog, buttonSet));

        $(document).on('keydown', function(e){
            if (e.which == ac.ESC_KEY){
                dialog.close();
            }
        });

        $('body').append(elem);

        return dialog;
    };


    confirm: function(message, action){
        var self = this;
        this.open('', '<p>' + message + '</p>', [
            {title: 'OK', action: function(){
                action();
                self.close();
            }},
            {title: 'Cancel', action: function(){
                self.close();
            }}
        ]);
    }

    return {
        openModalDialog: openModalDialog
    };*/
});
