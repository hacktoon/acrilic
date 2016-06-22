
ac.export("widget", function(env){
    "use strict";

    var $dialog = ac.import("dialog"),
        $dom = ac.import("dom");

    return {
        createContainer: function(selector, children){
            var target = $dom.get(selector);
            target.append(children);
            return target;
        },

        createTileButton: function(options, action){
            var div = $dom.create("div", options);
            div.addClass("tile");
            div.attr("id", options.id);
            $dom.append(div, options.content);
            $dom.on("click", div, action);
            return div;
        },

        createDialogHandler: function(options){
            var self = this,
                opt = options || {},
                templateString = $(opt.templateSelector).html();

                var confirm_$dialog = $dialog.modal(opt.title, $(templateString), opt.buttonSet);
            $(opt.btnSelector).on('click', function(){
                confirm_$dialog.open();
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
