
ac.export("widget", function(env){
    "use strict";

    var $dom = ac.import("dom"),
        $graphics = ac.import("graphics"),
        $dialog = ac.import("dialog");

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

        this.getGraphic = function(){
            return this.tile.getGraphic();
        };

        this.render = function(){
            this.elem.addClass("tile");
            return this.elem;
        };
    };

    var createDialogHandler = function(title, options){
        var opt = options || {},
            templateString = $(optnão.templateSelector).html();

        var confirm_dialog = $dialog.createConfirmDialog(title, $(templateString));
        var button = $(opt.btnSelector);
        button.on('click', function(){
            ac.log('f');
            confirm_dialog.open();
            opt.initialize();
        });
    };

    var createSwitchModeHandler = function(generalSelector, options, action){
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
    };


    return {
        createSwitchModeHandler: createSwitchModeHandler,
        createDialogHandler: createDialogHandler,
        init: init,
        createContainer: createContainer,
        createTileWidget: createTileWidget
    };
});
