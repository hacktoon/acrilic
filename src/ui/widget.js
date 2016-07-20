
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

    var createContainer = function(selector, children){
        var target = $dom.getElement(selector);
        var tile_elements = [];
        children.forEach(function(tile_widget, _){
            tile_elements.push(tile_widget.render());
        });
        target.append(tile_elements);
    };

    var createTileWidget = function(tile, action){
        var tile_button = new TileWidget(tile);
        tile_button.onClick(action);
        return tile_button;
    };

    var createBoardLayers = function(boardElement){
        var graphic = $graphics.createGraphic(tilesize, tilesize);
        return layer;
    };

    var createBoard = function(selector, action){
        var doc = $dom.getElement(document),
            x = 0,
            y = 0,
            ts = env.get("TILESIZE"),
            cursorDragging = false,
            boardElement = $dom.getElement(selector),
            selectCursor = $dom.createElement("div");

        selectCursor.addClass("selection-cursor");
        selectCursor.style({width: ts, height: ts});

        boardElement.append(selectCursor);
        boardElement.on('mousemove', function(e){
            //deslocamento em relacao à tela
            var x_offset = boardElement.getPosition("left"),
                y_offset = boardElement.getPosition("top"),
                x_scroll = boardElement.getScroll("left") + doc.getScroll("left"),
                y_scroll = boardElement.getScroll("top") + doc.getScroll("top");
            //posição relativa do mouse
            var rx = e.pageX - x_offset + x_scroll,
                ry = e.pageY - y_offset + y_scroll;

            rx = (rx < 0) ? 0 : rx;
            ry = (ry < 0) ? 0 : ry;
            x = Math.floor(rx / ts);
            y = Math.floor(ry / ts);

            selectCursor.style({transform: "translate(" + (x * ts) + "px, " + (y * ts) + "px)"});

            // Allows painting while dragging
            if(cursorDragging){
                action(x, y, {dragging: true});
            }
        });

        boardElement.on('mousedown', function(e){
            e.preventDefault();
            cursorDragging = true;
            action(x, y);
        });

        doc.on('mouseup', function(){
            cursorDragging = false;
        });
    };

    var createDialogHandler = function(title, options){
        var opt = options || {},
            templateString = $dom.getElement(optnão.templateSelector).html();

        var confirm_dialog = $dialog.createConfirmDialog(title, $(templateString));
        var button = $dom.getElement(opt.btnSelector);
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

    var setButton = function(selector, action){
        $dom.getElement(selector).on('click', action);
    };

    var createButton = function(title, action){
        return {title: title, action: action};
    };

    return {
        createSwitchModeHandler: createSwitchModeHandler,
        createDialogHandler: createDialogHandler,
        createBoard: createBoard,
        createButton: createButton,
        setButton: setButton,
        createContainer: createContainer,
        createTileWidget: createTileWidget
    };
});
