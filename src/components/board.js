
ac.export("board", function(env){
	"use strict";

	var $map = ac.import("map"),
        $canvas = ac.import("canvas");

    var container = $("#board-panel"),
        layer_canvas = {fg: '', bg: '', evt: ''},
        cursor_class = "selection-cursor";

    var setLayer = function(id){
        id = 0;
    };

    var createCursor = function(size) {
        var cursor = $("<div/>")
            .addClass(cursor_class)
            .css({width: size, height: size});
        return cursor;
    };

    var getRelativeMousePosition = function(event, tilesize) {
        //deslocamento em relacao à tela
        var doc = $(document);
        var x_offset = container.offset().left,
            y_offset = container.offset().top,
            x_scroll = container.scrollLeft() + doc.scrollLeft(),
            y_scroll = container.scrollTop() + doc.scrollTop();
        //posição relativa do mouse
        var rx = event.pageX - x_offset + x_scroll,
            ry = event.pageY - y_offset + y_scroll;

        rx = (rx < 0) ? 0 : rx;
        ry = (ry < 0) ? 0 : ry;
        return {x: Math.floor(rx / tilesize), y: Math.floor(ry / tilesize)};
    };

    var registerEvents = function(board, action){
        var tilesize = env.get("TILESIZE"),
            selectCursor = board.find("."+cursor_class),
            x = 0,
            y = 0,
            mouseDown = false;

        board.on('mousemove', function(event){
            var pos = getRelativeMousePosition(event, tilesize);
            x = pos.x;
            y = pos.y;

            selectCursor.css({
                transform: "translate(" + (x * tilesize) + "px, " + (y * tilesize) + "px)"
            });

            // Allows painting while dragging
            if(mouseDown){
                action(x, y);
            }
        });

        board.on('mousedown', function(e){
            e.preventDefault();
            mouseDown = true;
            action(x, y);
        });

        $(document).on('mouseup', function(){
            mouseDown = false;
        });
    };

    var createElements = function(h_tiles, v_tiles) {
        var tilesize = env.get("TILESIZE"),
            board = $('<div/>'),
            width = tilesize * h_tiles,
            height = tilesize * v_tiles,
            evt_layer = $('<canvas/>').attr('id', 'evt_layer').addClass('layer'),
            fg_layer = $('<canvas/>').attr('id', 'fg_layer').addClass('layer'),
            bg_layer = $('<canvas/>').attr('id', 'bg_layer').addClass('layer');


        evt_layer.width();
        board.append(createCursor(tilesize));
        board.append([evt_layer, fg_layer, bg_layer]);
        board.width(width).height(height);
        return board;
    };

	var createBoard = function(map_name, h_tiles, v_tiles){
        var board = createElements(h_tiles, v_tiles);
        registerEvents(board, function(x, y) {
            ac.log(x, y);
        });
        container.html(board);
	};

    return {
        createBoard: createBoard
    };
});
