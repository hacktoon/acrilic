
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "display", "tools");

    var self = {
        container: $("#board"),
        overlay: $("#board-overlay"),
        selector: $("#board-selector"),
        tileset: undefined,
        map: undefined,
        tool: undefined,
        layers: [],
        mouse: {
            down: false, over: false, ready: true, row: 0, col: 0
        };
    };



    var updateSelector = function(self.mouse){
        var selection = env.get("SELECTED_TILES"),
            tsize = self.tileset.tilesize,
            x = tsize * self.mouse.col,
            y = tsize * self.mouse.row;

        self.selector.css({
            transform: "translate(" + x + "px, " + y + "px)",
            height: tsize * selection.rows,
            width: tsize * selection.cols,
            display: self.mouse.over && self.mouse.ready ? "block" : "none"
        });
    };

    var mouseDownEvent = function(){
        if ( ! self.layers.length ) { return; }
        var modifiedCells = tool().mousedown(self.mouse.row, self.mouse.col, self.map);
        paintBoard(modifiedCells);
        self.mouse.down = true;
    };

    var mouseMoveEvent = function(e){
        var tsize, pos;
        if ( ! self.layers.length ) { return; }
        tsize = self.tileset.tilesize;
        pos = ac.utils.getRelativeMousePosition(self.container, tsize, e.pageX, e.pageY);
        self.mouse.col = pos.col;
        self.mouse.row = pos.row;
        if (self.mouse.down && self.mouse.over){  // allow painting while dragging
            var modifiedCells = tool().drag(self.mouse.row, self.mouse.col, self.map);
            paintBoard(modifiedCells);
        }
        updateSelector(self.mouse);
    };

    var tileSelectionEndEvent = function(){
        if ( ! self.layers.length ) { return; }
        self.mouse.ready = true;
        updateSelector(self.mouse);
    };

    var registerEvents = function(){
        self.overlay
        .on("mouseenter", function(){ self.mouse.over = true; })
        .on("mouseleave", function(){ self.mouse.over = false; })
        .on('mousedown', function(){ mouseDownEvent(); });

        env.get("DOCUMENT")
        .on("mouseup", function(){ self.mouse.down = false; })
        .on('mousemove', function(e){ mouseMoveEvent(e); })
        .on("tileSelectionStart", function(){ self.mouse.ready = false; })
        .on("tileSelectionEnd", function(){ tileSelectionEndEvent(); })
        .on("layerChange", function(){ showCurrentLayer(); });
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
