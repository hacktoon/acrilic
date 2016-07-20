
ac.export("dialog", function(env){
    "use strict";

    var $dom = ac.import("dom");

    function Dialog(title, templateSelector){
        (function init(){
            var content = $dom.getFromTemplate(templateSelector);
            this.title = title;
            this.elem = $dom.getFromTemplate('#tpl-dialog-overlay');
            debugger;
            this.close_button = $('.btn-close', this.elem);
            this.close_button.on('click', function(){
                this.close();
            }.bind(this));
            $('.dialog-titlebar .title', this.elem).html(title);
            $('.dialog-content', this.elem).html(content);
            $('body').append(this.elem);
            $(document).on('keydown', function(e){
                if (e.which == ac.ESC_KEY){
                    this.close();
                }
            }.bind(this));
        }.bind(this))();

        this.setButtons = function(buttonSet){
            var output = '';
            var setButtonAction = function(btn, id){
                this.elem.on('click', '#' + id, function(){
                    btn.action(this);
                }.bind(this));
            };
            for (var i=0; i<buttonSet.length; i++){
                var btn = buttonSet[i],
                    id = 'btn-' + btn.title.replace(/\s+/g, '-').toLowerCase();
                output += '<button id="' + id + '">' + btn.title + '</button>';
                setButtonAction.apply(this, btn, id);
            }
            $('.dialog-button-panel', this.elem).html(output);
        };

        this.open = function(){
            this.elem.show();
        };

        this.close = function(){
            this.elem.hide();
        };
    };

    var createFormDialog = function(title, options){
        var opt = options || {};
        var dialog = new Dialog(title, opt.templateSelector);
        dialog.setButtons(opt.buttonSet);
        dialog.open();
        return dialog;
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
        createConfirmDialog: createConfirmDialog,
        createFormDialog: createFormDialog
    };
});
