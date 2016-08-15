
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "map", "layer", "palette", "tools", "fs");

    var _self = {
        doc: $(document),
        container: $("#board-panel"),
        overlay: undefined,
        currentLayer: 0,
        currentMap: undefined,
        cursor: undefined
    };

    var setCursorPosition = function(row, col){
        var tsize = env.get("TILESIZE");
        _self.cursor.css({
            transform: "translate(" + (col * tsize) + "px, " + (row * tsize) + "px)"
        });
    };

    var registerEvents = function(board, action){
        var mouseUp = true,
            mouseOut = true,
            col = 0,
            row = 0;

        _self.overlay
        .on('mousemove', function(event){
            var pos = ac.utils.getRelativeMousePosition(event, _self.container);
            row = pos.y;
            col = pos.x;

            setCursorPosition(row, col);

            // Allows painting while dragging
            mouseUp || action(row, col);
        }).on('mousedown', function(e){
            e.preventDefault();
            mouseUp = false;
            action(row, col);
        }).on('mouseenter', function(e){
            mouseOut = false;
            if(ac.palette.getSelection()){
                _self.cursor.show();
            }
        }).on('mouseleave', function(e){
            mouseOut = true;
            mouseUp = true;
            _self.cursor.hide();
        }).on('mouseup', function(){
            mouseUp = true;
        });

        _self.doc.on("selection-ready", function(){
            var selection = ac.palette.getSelection();
            _self.cursor.css({
                width: selection.width,
                height: selection.height
            });
            mouseOut || _self.cursor.show();
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

        //map.getLayer() is used here only to send a matrix with specific cols x rows
        ac.utils.iterate2DArray(map.getLayer(), function(row, col) {
            for(var layerIndex in ac.layer.getLayers()){
                var tile_id = map.get(layerIndex, row, col),
                    tile = ac.palette.getTile(tile_id);
                if (! tile){ continue; }
                ac.layer.updateLayer(layerIndex, col*tsize, row*tsize, tile.getCanvas());
            }
        });
    };

    var saveMap = function(map) {
        ac.fs.saveFile(map.name, ac.map.exportMap(map));
    };

    var updateMap = function(eventRow, eventCol) {
        var tsize = env.get("TILESIZE"),
            tool = ac.tools.getCurrentTool(),
            map = _self.currentMap,
            selection = ac.palette.getSelection(),
            layerIndex = _self.currentLayer,
            mapLayer = map.getLayer(layerIndex),
            selectedTiles = tool(mapLayer, eventRow, eventCol);

        selectedTiles.forEach(function(tile){
            var tileCol = tile.col,
                tileRow = tile.row,
                x = tileCol * tsize,
                y = tileRow * tsize;
            // update the layers with the new tile image
            ac.layer.updateLayer(layerIndex, x, y, selection.image);
            // update the map grid with the new tile ids
            map.update(layerIndex, tileRow, tileCol, selection.submap);
        });
        saveMap(map);
    };

    var activateLayer = function(index) {
        ac.layer.activateLayer(index || 0);
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
        env.set('CURRENT_MAP', map);
        createLayers(board, width, height);
        registerEvents(board, updateMap);
        activateLayer(_self.currentLayer);
        saveMap(map);
    };

    return {
        createBoard: createBoard,
        activateLayer: activateLayer,
        renderMap: renderMap
    };
});
