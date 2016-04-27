
AC.Base.Dialog = (function(){
    "use strict";

    var _dialogObject = {
        elem: undefined,
        open: function(){
            this.elem.show();
        },
        close: function(){
            this.elem.hide();
        },
    };

    var _buildDialogButtons = function(dialog, buttonSet){
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

    return {
        modal: function(title, content, buttonSet){
            var dialog = $.extend(true, {}, _dialogObject),
                elem = dialog.elem = $($('#tpl-dialog-overlay').html());
            elem.find('.btn-close').on('click', function(){
                dialog.close();
            });
            elem.find('.dialog-titlebar .title').html(title);
            elem.find('.dialog-content').html(content);
            elem.find('.dialog-button-panel').html(_buildDialogButtons(dialog, buttonSet));

            $(document).on('keydown', function(e){
                if (e.which == AC.ESC_KEY){
                    dialog.close();
                }
            });

            $('body').append(elem);

            return dialog;
        },

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
    };

})();
