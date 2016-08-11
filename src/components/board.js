
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "map");

    var _self = {
        container: $("#board-panel"),
        cursor: undefined,
        currentMap: undefined
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

    var createCursor = function(size) {
        _self.cursor = $("<div/>")
            .addClass("selection-cursor")
            .css({width: size, height: size});
        return _self.cursor;
    };

    var createElements = function(map) {
        var tsize = env.get("TILESIZE"),
            board = $('<div/>').addClass('board');

        board.append(createCursor(tsize))
            .width(tsize * map.rows)
            .height(tsize * map.cols);
        _self.container.html(board);
        return board;
    };

    var activateLayer = function(index) {
        // TODO: in a multi-map configuration, this function shall
        // activate the layer in all maps
        _self.currentMap.activateLayer(index);
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

    var boardAction = function(row, col) {
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
        registerEvents(board, boardAction);
    };

    return {
        createBoard: createBoard,
        activateLayer: activateLayer,
        renderMap: renderMap
    };
});
