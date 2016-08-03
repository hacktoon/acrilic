
ac.export("board", function(env){
	"use strict";

	var $map = ac.import("map"),
        $canvas = ac.import("canvas"),
        $tools = ac.import("tools"),
        $palette = ac.import("palette");

    var container = $("#board-panel"),
        current_layer_id = 'bg',
        layers = {
            bg: undefined,
            fg: undefined,
            evt: undefined
        },
        cursor_class = "selection-cursor";

    var getCurrentLayer = function() {
        return layers[current_layer_id];
    };

    var getLayer = function(id) {
        return layers[id];
    };

    var activateLayer = function(id){
        var current_layer = getCurrentLayer();
        current_layer_id = id;
        if (! current_layer){
            return;
        }
        current_layer.elem.removeClass('active');
        current_layer = getCurrentLayer();
        current_layer.elem.addClass('active');
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
            mouseDown = false,
            x = 0,
            y = 0;

        board.on('mousemove', function(event){
            var pos = getRelativeMousePosition(event, tilesize);

            x = pos.x;
            y = pos.y;

            board.find("."+cursor_class).css({
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

    var createLayer = function(board, id, width, height) {
        var layer = $canvas.createCanvas(width, height);
        layer.elem.attr('id', id).addClass('layer');
        board.append(layer.elem);
        return layer;
    };

    var createElements = function(h_tiles, v_tiles) {
        var tilesize = env.get("TILESIZE"),
            board = $('<div/>').addClass('board'),
            width = tilesize * h_tiles,
            height = tilesize * v_tiles;

        layers.evt = createLayer(board, 'evt-layer', width, height),
        layers.fg = createLayer(board, 'fg-layer', width, height),
        layers.bg = createLayer(board, 'bg-layer', width, height);

        activateLayer('bg');

        board.append(createCursor(tilesize)).width(width).height(height);
        return board;
    };

    var updateMap = function(map, orig_col, orig_row, selection) {
        var tsize = env.get("TILESIZE"),
            matrix = selection.matrix,
            tool = $tools.getTool(),
            current_layer = getCurrentLayer();

        tool(map, orig_row, orig_col, selection).forEach(function(tile){
            var col = tile.col,
                row = tile.row,
                x = col * tsize,
                y = row * tsize;

            // render the selected area
            current_layer.clear(x, y, selection.width, selection.height);
            if (tile.reset){
                var cell = map.get(col, row) || {};
                delete cell[current_layer_id];
                map.set(col, row, cell);
                return;
            }
            current_layer.draw(selection.image, 0, 0, x, y);

            // update the map grid with the new tile ids
            for(var i=0; i<matrix.length; i++){
                for(var j=0; j<matrix[i].length; j++){
                    var cell = map.get(j+col, i+row) || {};
                    cell[current_layer_id] = matrix[i][j];
                    map.set(j+col, i+row, cell);
                }
            }
        });
    };

    var renderMap = function(map) {
        var tsize = env.get("TILESIZE");
        for (var y = 0; y < map.height; y++) {
            for (var x = 0; x < map.width; x++) {
                var cell = map.get(x, y);
                for (var key in cell){
                    var tile = $palette.getTile(cell[key]);
                    if (! tile){ continue; }
                    getLayer(key).draw(tile.getCanvas(), 0, 0, x * tsize, y * tsize);
                }
            }
        }
    };

	var createBoard = function(map, h_tiles, v_tiles){
        var board = createElements(h_tiles, v_tiles);
        registerEvents(board, function(x, y) {
            updateMap(map, x, y, $palette.getSelection());
        });
        container.html(board);
	};

    return {
        createBoard: createBoard,
        renderMap: renderMap,
        activateLayer: activateLayer
    };
});
