
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "map", "layer", "palette", "tools");

    var _self = {
        container: $("#board-panel"),
        overlay: undefined,
        currentLayer: 0,
        currentMap: undefined,
        cursor: undefined
    };

    var registerEvents = function(board, action){
        var tsize = env.get("TILESIZE"),
            mouseDown = false,
            col = 0,
            row = 0;

        _self.overlay.on('mousemove', function(event){
            var pos = ac.utils.getRelativeMousePosition(event, _self.container);
            row = pos.y;
            col = pos.x;

            _self.cursor.css({
                transform: "translate(" + (col * tsize) + "px, " + (row * tsize) + "px)"
            });

            if(mouseDown){
                action(row, col);  // Allows painting while dragging
            }
        }).on('mousedown', function(e){
            e.preventDefault();
            mouseDown = true;
            action(row, col);
        }).on('mouseenter', function(e){
            var selection = ac.palette.getSelection();
            _self.cursor.css({
                width: selection.width,
                height: selection.height
            }).show();
        }).on('mouseleave', function(e){
            _self.cursor.hide();
        });

        $(document).on('mouseup', function(){
            mouseDown = false;
        });
    };

    var createCursor = function() {
        var tsize = env.get("TILESIZE");
        var cursor = $("<div/>")
            .addClass("selection-cursor")
            .css({width: tsize, height: tsize})
            .hide();
        return cursor;
    };

    var createElements = function(width, height) {
        var board = $('<div/>').addClass('board'),
            overlay = $("<div/>").addClass("board-overlay")
                .css({width: width, height: height});
        board.width(width).height(height);
        _self.cursor = createCursor();
        _self.overlay = overlay.append(_self.cursor);
        _self.container.html([board, overlay]);
        return board;
    };

    var renderMap = function() {
        var tsize = env.get("TILESIZE"),
            map = _self.currentMap;

        ac.utils.iterate2DArray(map.asArray(), function(row, col) {
            for(var layerIndex in ac.layer.getLayers()){
                var tile_id = map.get(layerIndex, row, col),
                    tile = ac.palette.getTile(tile_id);
                if (! tile){ continue; }
                ac.layer.updateLayer(layerIndex, col*tsize, row*tsize, tile.getCanvas());
            }
        });
    };

    var updateMap = function(orig_row, orig_col) {
        var tsize = env.get("TILESIZE"),
            tool = ac.tools.getCurrentTool(),
            map = _self.currentMap,
            selection = ac.palette.getSelection(),
            submap = selection.submap,
            layerIndex = _self.currentLayer;

        tool(map, orig_row, orig_col, selection).forEach(function(tile){
            var tile_col = tile.col,
                tile_row = tile.row,
                x = tile_col * tsize,
                y = tile_row * tsize;

            ac.layer.updateLayer(layerIndex, x, y, selection.image);

            // update the map grid with the new tile ids
            ac.utils.iterate2DArray(submap, function(subrow, subcol) {
                var row = subrow + tile_row,
                    col = subcol + tile_col;

                if (! map.inRange(row, col)) { return; }
                var cell = map.get(layerIndex, row, col) || {};
                map.set(layerIndex, row, col, submap[subrow][subcol]);
            });
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
        _self.currentMap = map;
        createLayers(board, width, height);
        registerEvents(board, updateMap);
    };

    return {
        createBoard: createBoard,
        activateLayer: activateLayer,
        renderMap: renderMap
    };
});
