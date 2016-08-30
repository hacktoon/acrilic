
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "tilesets", "tools");

    var self = {
        container: $("#board"),
        overlay: $("#board-overlay"),
        selector: $("#board-selector"),
        tileset: undefined,
        map: undefined,
        layers: []
    };

    var updateSelector = function(mouseState){
        var selection = env.get("SELECTED_TILES"),
            tsize = self.tileset.tilesize,
            x = tsize * mouseState.col,
            y = tsize * mouseState.row;

        self.selector.css({
            transform: "translate(" + x + "px, " + y + "px)",
            height: tsize * selection.length,
            width: tsize * selection[0].length,
            display: mouseState.over && mouseState.ready ? "block" : "none"
        });
    };

    var registerEvents = function(){
        var mousePos = ac.utils.getRelativeMousePosition,
            mouseState = {
                down: false, over: false, ready: true, row: 0, col: 0
            };

        self.overlay
        .on("mouseenter", function(){ mouseState.over = true; })
        .on("mouseleave", function(){ mouseState.over = false; })
        .on('mousedown', function(event){
            if ( ! self.layers.length ) { return; }
            //ac.tools.mousedown(row, col);
            mouseState.down = true;
        });

        env.get("DOCUMENT")
        .on("mouseup", function(event){ mouseState.down = false; })
        .on("tileSelectionStart", function(){ mouseState.ready = false; })
        .on("tileSelectionEnd", function(){
            // event triggered when the mouse is released on palette selection
            if ( ! self.layers.length ) { return; }
            mouseState.ready = true;
            updateSelector(mouseState);
        })
        .on("layerChange", function(event){
            if ( ! self.layers.length ) { return; }
            showCurrentLayer();
        })
        .on('mousemove', function(event){
            var tsize, pos;
            if ( ! self.layers.length ) { return; }
            tsize = self.tileset.tilesize;
            pos = mousePos(self.container, tsize, event.pageX, event.pageY);
            mouseState.col = pos.col;
            mouseState.row = pos.row;
            if (mouseState.down){
                // allow painting while dragging
                //ac.tools.drag(row, col, self.map, self.layers);
            }
            updateSelector(mouseState);
        });
    };

    var showCurrentLayer = function() {
        var index = env.get("CURRENT_LAYER");
        $("#board .layer.active").removeClass("active");
        $(self.layers[index]).addClass("active");
    };

    var createLayers = function(width, height) {
        var layers = [];
        for(var i=0; i<3; i++){
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

        self.tileset = tileset;
        self.map = map;
        self.selector.css({width: tsize, height: tsize});
        self.overlay.css({width: width, height: height});
        self.container.css({width: width, height: height});
        createLayers(width, height);
    };

    var init = function(){
        registerEvents();
    };

    return {
        init: init,
        loadFile: loadFile
    };
});
