
AC.Dialog = (function(){
    "use strict";

    var buildDialogButtons = function(dialog, buttonSet){
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
            $('#dialog-overlay').remove();
        },

        open: function(title, content, buttonSet){
            var self = this,
                dialog = $($('#tpl-dialog-overlay').html()),
                dialogContent = dialog.find('#dialog-content'),
                dialogButtonSet = dialog.find('#dialog-button-panel');

            dialog.find('#dialog-titlebar .title').html(title);
            dialogContent.html(content);
            dialogButtonSet.html(buildDialogButtons(dialog, buttonSet));
            dialog.appendTo('body')
                .find('.btn-close').on('click', function(){
                    self.close();
                })
                .show();
        },

        confirm: function(message, action){
            var self = this;
            this.open('', '<p>' + message + '</p>', [
                {title: 'OK', action: function(){
                    action();
                    self.closeDialog();
                }},
                {title: 'Cancel', action: function(){
                    self.closeDialog();
                }}
            ]);
        },

        alert: function(message, action){
            var self = this;
            this.open('', '<p>' + message + '</p>', [
                {title: 'OK', action: function(){
                    self.closeDialog();
                }}
            ]);
        }
    };

})();
