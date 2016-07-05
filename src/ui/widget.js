
ac.export("widget", function(env){
    "use strict";

    var $dom = ac.import("dom");

    function TileWidget(tile){
        var activeClass = "active";

        (function init(){
            this.tile = tile;
            this.elem = tile.render();
        }.bind(this))();

        this.onClick = function(action){
            this.elem.on("click", action);
        };

        this.select = function(){
            this.elem.addClass(activeClass);
        };

        this.unselect = function(){
            this.elem.removeClass(activeClass);
        };

        this.render = function(){
            this.elem.addClass("tile");
            return this.elem;
        };
    };

    return {
        createContainer: function(selector, children){
            var target = $dom.getElement(selector);
            ac.log(children);
            target.append(children);
        },

        createTileWidget: function(tile, action){
            var tile_button = new TileWidget(tile);
            tile_button.onClick(action);
            return tile_button;
        },

        createDialogHandler: function(options){
            /*var self = this,
                opt = options || {},
                templateString = $(opt.templateSelector).html();

                var confirm_$dialog = $dialog.modal(opt.title, $(templateString), opt.buttonSet);
            $(opt.btnSelector).on('click', function(){
                confirm_dialog.open();
                if ($.isFunction(opt.initialize)){
                    opt.initialize();
                }
            });*/
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
