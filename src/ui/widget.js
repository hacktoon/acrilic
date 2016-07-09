
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

        this.getGraphic = function(){
            return this.tile.getGraphic();
        };

        this.render = function(){
            this.elem.addClass("tile");
            return this.elem;
        };
    };

    return {
        createContainer: function(selector, children){
            var target = $dom.getElement(selector);
            var tile_elements = [];
            children.forEach(function(tile_widget, _){
                tile_elements.push(tile_widget.render());
            });
            target.append(tile_elements);
        },

        createTileWidget: function(tile, action){
            var tile_button = new TileWidget(tile);
            tile_button.onClick(action);
            return tile_button;
        },

        createBoard: function(selector, action){
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
