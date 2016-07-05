
ac.export("widget", function(env){
    "use strict";

    var $dialog = ac.import("dialog"),
        $dom = ac.import("dom");

    function TileButton(tile){
        var activeClass = "active";

        (function init(){
            this.tile = tile;
            this.elem = tile.render();
        }.bind(this))();

        this.onClick = function(action){
            $dom.on("click", this.elem, action);
        };

        this.select = function(){
            $dom.addClass(this.elem, activeClass);
        };

        this.unselect = function(){
            $dom.removeClass(this.elem, activeClass);
        };

        this.render = function(){
            $dom.addClass(this.elem, "tile");
            return this.elem;
        };
    };

    return {
        createContainer: function(selector, children){
            var target = $dom.get(selector);
            target.append(children);
            return target;
        },

        createTileButton: function(tile, action){
            var tile_button = new TileButton(tile);
            tile_button.onClick(action);
            return tile_button;
        },

        createDialogHandler: function(options){
            var self = this,
                opt = options || {},
                templateString = $(opt.templateSelector).html();

                var confirm_$dialog = $dialog.modal(opt.title, $(templateString), opt.buttonSet);
            $(opt.btnSelector).on('click', function(){
                confirm_dialog.open();
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
