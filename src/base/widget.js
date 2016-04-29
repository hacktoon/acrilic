ac.export("widget", function(){
    "use strict";
    
    return {
        createDialogHandler: function(options){
            var self = this,
                opt = options || {},
                templateString = $(opt.templateSelector).html();

            var dialog = _Dialog.modal(opt.title, $(templateString), opt.buttonSet);
            $(opt.btnSelector).on('click', function(){
                dialog.open();
                if ($.isFunction(opt.initialize)){
                    opt.initialize();
                }
            });
        },

        createSwitchModeHandler: function(generalSelector, options, action){
            var toggleClass = 'active',
                optionList = $(generalSelector);

            optionList.on('click', function(e){
                optionList.removeClass(toggleClass);
                var target = $(this),
                    id = target.attr('id'),
                    value = options[id];
                target.addClass(toggleClass);
                action(value);
            });
            optionList.first().trigger('click');
        }
    };
});
