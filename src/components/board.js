
ac.export("board", function(env){
	"use strict";

	var $utils = ac.import("utils");

    var _self = {
        container: $("#board-panel"),
        cursor: undefined,
        currentMap: undefined,
        currentLayer: 0
    };

    var getRelativeMousePosition = function(event, tilesize) {
        //deslocamento em relacao à tela
        var doc = $(document);
        var x_offset = _self.container.offset().left,
            y_offset = _self.container.offset().top,
            x_scroll = _self.container.scrollLeft() + doc.scrollLeft(),
            y_scroll = _self.container.scrollTop() + doc.scrollTop();
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
            col = 0,
            row = 0;

        board.on('mousemove', function(event){
            var pos = getRelativeMousePosition(event, tilesize);

            row = pos.y;
            col = pos.x;

            _self.cursor.css({
                transform: "translate(" + (col * tilesize) + "px, " + (row * tilesize) + "px)"
            });

            // Allows painting while dragging
            if(mouseDown){
                action(row, col);
            }
        });

        board.on('mousedown', function(e){
            e.preventDefault();
            mouseDown = true;
            action(row, col);
        });

        $(document).on('mouseup', function(){
            mouseDown = false;
        });
    };

    var createCursor = function(size) {
        _self.cursor = $("<div/>")
            .addClass("selection-cursor")
            .css({width: size, height: size});
        return _self.cursor;
    };

    var createElements = function(map) {
        var tsize = env.get("TILESIZE"),
            board = $('<div/>').addClass('board'),
            layers = $utils.filter(map.layers, function(layer){
                return layer.getElement();
            });

        board.append(layers)
            .append(createCursor(tsize))
            .width(tsize * map.rows)
            .height(tsize * map.cols);

        return board;
    };

    var activateLayer = function(id){
        _self.currentLayer = id;
    };

    var renderMap = function() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                var tile_id = layer.get(row, col);
                var tile = $palette.getTile(tile_id);
                if (! tile){ return; }
                layer.draw(tile.getCanvas(), row, col);
            }
        }
    };

    var updateMap = function(row, col) {
        var tsize = env.get("TILESIZE"),
            tool = $tools.getTool(),
            map = _self.currentMap,
            selection = $palette.getSelection(),
            matrix = selection.matrix;

        tool(map, orig_row, orig_col, selection).forEach(function(tile){
            var col = tile.col,
                row = tile.row,
                x = col * tsize,
                y = row * tsize;

            // render the selected area
            current_layer.clear(x, y, selection.width, selection.height);
            map.draw(selection.image, 0, 0, x, y);

            // update the map grid with the new tile ids
            for(var i=0; i<matrix.length; i++){
                for(var j=0; j<matrix[i].length; j++){
                    var cell = map.get(i+row, j+col) || {};
                    cell[current_layer_id] = matrix[i][j];
                    map.set(i+row, j+col, cell);
                }
            }
        });
    };

	var createBoard = function(map){
        var board = createElements(map);
        _self.currentMap = map;
        registerEvents(board, updateMap);
        _self.container.html(board);
	};

    return {
        createBoard: createBoard,
        activateLayer: activateLayer
    };
});
