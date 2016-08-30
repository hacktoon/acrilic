
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "tools");

    var self = {
        container: $("#board"),
        overlay: $("#board-overlay"),
        selector: $("#board-selector"),
        tileset: undefined,
        map: undefined,
        layers: []
    };

    var paintCell = function(row, col, layerID) {
        var id = self.map.get(row, col),
            tile = self.tileset.getTileByID(id),
            tsize = self.tileset.tilesize,
            x = tsize * col,
            y = tsize * row,
            context = self.layers[layerID].getContext("2d");
        context.clearRect(x, y, tsize, tsize);
        context.drawImage(tile.canvas, x, y);
    };

    var paintBoard = function(cells) {
        if (cells){
            for(var i=0; i<cells.length; i++){
                paintCell(cells[i].row, cells[i].col, env.get("CURRENT_LAYER"));
            }
            return;
        }
        // paint the entire board by default
        for(var layerID=0; layerID<self.layers.length; layerID++){
            for(var row=0; row<self.map.rows; row++){
                for(var col=0; col<self.map.cols; col++){
                    paintCell(row, col, layerID);
                }
            }
        }
    };

    var updateSelector = function(mouseState){
        var selection = env.get("SELECTED_TILES"),
            tsize = self.tileset.tilesize,
            x = tsize * mouseState.col,
            y = tsize * mouseState.row;

        self.selector.css({
            transform: "translate(" + x + "px, " + y + "px)",
            height: tsize * selection.rows,
            width: tsize * selection.cols,
            display: mouseState.over && mouseState.ready ? "block" : "none"
        });
    };

    var registerEvents = function(){
        var tool = ac.tools.getTool,
            mousePos = ac.utils.getRelativeMousePosition,
            mouseState = {
                down: false, over: false, ready: true, row: 0, col: 0
            };

        self.overlay
        .on("mouseenter", function(){ mouseState.over = true; })
        .on("mouseleave", function(){ mouseState.over = false; })
        .on('mousedown', function(){
            if ( ! self.layers.length ) { return; }
            var modifiedCells = tool().mousedown(mouseState.row, mouseState.col, self.map);
            paintBoard(modifiedCells);
            mouseState.down = true;
        });

        env.get("DOCUMENT")
        .on("mouseup", function(){ mouseState.down = false; })
        .on("tileSelectionStart", function(){ mouseState.ready = false; })
        .on("tileSelectionEnd", function(){
            if ( ! self.layers.length ) { return; }
            mouseState.ready = true;
            updateSelector(mouseState);
        })
        .on("layerChange", function(){ showCurrentLayer(); })
        .on('mousemove', function(e){
            var tsize, pos;
            if ( ! self.layers.length ) { return; }
            tsize = self.tileset.tilesize;
            pos = mousePos(self.container, tsize, e.pageX, e.pageY);
            mouseState.col = pos.col;
            mouseState.row = pos.row;
            if (mouseState.down && mouseState.over){  // allow painting while dragging
                var modifiedCells = tool().drag(mouseState.row, mouseState.col, self.map);
                paintBoard(modifiedCells);
            }
            updateSelector(mouseState);
        });
    };

    var showCurrentLayer = function() {
        if ( ! self.layers.length ) { return; }
        var index = env.get("CURRENT_LAYER");
        $("#board .layer.active").removeClass("active");
        $(self.layers[index]).addClass("active");
    };

    var createLayers = function(width, height) {
        var layers = [];
        for(var i=0; i<ac.LAYERS; i++){
            var layer = ac.utils.createCanvas(width, height);
            $(layer).addClass("layer");
            layers.push(layer);
        }
        self.layers = layers;
        self.container.html(layers);
        showCurrentLayer();
    };

    var loadFile = function(map, tileset){
        var tsize = tileset.tilesize,
            width = map.cols * tsize,
            height = map.rows * tsize;

        self.selector.css({width: tsize, height: tsize});
        self.overlay.css({width: width, height: height});
        self.container.css({width: width, height: height});
        self.tileset = tileset;
        self.map = map;
        createLayers(width, height);
        paintBoard();
    };

    var init = function(){
        registerEvents();
    };

    return {
        init: init,
        loadFile: loadFile
    };
});
