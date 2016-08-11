
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "map", "layer", "palette", "tools");

    var _self = {
        container: $("#board-panel"),
        currentLayer: 0,
        currentMap: undefined,
        cursor: undefined,
        width: 0,
        height: 0
    };

    var registerEvents = function(board, action){
        var tsize = env.get("TILESIZE"),
            mouseDown = false,
            col = 0,
            row = 0;

        board.on('mousemove', function(event){
            var pos = ac.utils.getRelativeMousePosition(event, _self.container);
            row = pos.y;
            col = pos.x;

            _self.cursor.css({
                transform: "translate(" + (col * tsize) + "px, " + (row * tsize) + "px)"
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

    var createCursor = function() {
        var tsize = env.get("TILESIZE");
        _self.cursor = $("<div/>")
            .addClass("selection-cursor")
            .css({width: tsize, height: tsize});
        return _self.cursor;
    };

    var createElements = function(width, height) {
        var board = $('<div/>').addClass('board');
        board.append(createCursor()).width(width).height(height);
        _self.container.html(board);
        return board;
    };

    var renderMap = function() {
        var tsize = env.get("TILESIZE"),
            map = _self.currentMap;

        ac.utils.iterate2DArray(map.rows, map.cols, function(row, col) {
            for(var index in ac.layer.getLayers()){
                var tile_id = map.get(index, row, col);
                var tile = ac.palette.getTile(tile_id);
                if (! tile){ continue; }
                ac.layer.updateLayer(index, tile.getCanvas(), row*tsize, col*tsize);
            }
        });
    };

    var boardAction = function(row, col) {
        var tsize = env.get("TILESIZE"),
            tool = ac.tools.getCurrentTool(),
            map = _self.currentMap,
            selection = ac.palette.getSelection(),
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

    var activateLayer = function(index) {
        ac.layer.activateLayer(index);
        _self.currentLayer = index;
    };

    var createLayers = function(board, width, height){
        var layers = ac.layer.createLayers(width, height),
            elements = ac.utils.map(layers, function(layer){
            return layer.getElement();
        });
        board.append(elements);
    };

    var createBoard = function(map){
        var tsize = env.get("TILESIZE"),
            width = map.cols * tsize,
            height = map.rows * tsize,
            board = createElements(width, height);
        _self.width = width;
        _self.height = height;
        _self.currentMap = map;
        createLayers(board, width, height);
        registerEvents(board, boardAction);
    };

    return {
        createBoard: createBoard,
        activateLayer: activateLayer,
        renderMap: renderMap
    };
});
