
AC.Dialog = (function(){
    "use strict";

    var _dialogStack = [];

    var _buildDialogButtons = function(dialog, buttonSet){
        var output = '';
        for (var i=0; i<buttonSet.length; i++){
            var btn = buttonSet[i],
                id = 'btn-' + btn.title.replace(/\s+/g, '-').toLowerCase();
            output += '<button id="' + id + '">' + btn.title + '</button>';
            dialog.on('click', '#' + id, btn.action);
        }
        return output;
    };

    return {
        close: function(){
            var dialog = _dialogStack.pop();
            dialog.remove();
        },

        open: function(title, content, buttonSet){
            var self = this,
                dialog = $($('#tpl-dialog-overlay').html()),
                dialogContent = dialog.find('.dialog-content'),
                dialogButtonSet = dialog.find('.dialog-button-panel');

            if (_dialogStack.length === 0){
                dialog.addClass('dim');
            }

            dialog.find('.btn-close').on('click', function(){
                self.close();
            });
            dialog.find('.dialog-titlebar .title').html(title);
            dialogContent.html(content);
            dialogButtonSet.html(_buildDialogButtons(dialog, buttonSet));
            dialog.appendTo('body').show();

            _dialogStack.push(dialog);
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
        },

        alert: function(message, action){
            var self = this;
            this.open('', '<p>' + message + '</p>', [
                {title: 'OK', action: function(){
                    self.close();
                }}
            ]);
        }
    };

})();
