
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "tilesets");

    var self = {
        container: $("#board"),
        overlay: $("#board-overlay"),
        selector: $("#board-selector"),
        tileset: undefined,
        map: undefined,
        layers: []
    };

    var updateCursor = function(params){
        var css = {};
        if (params.row !== undefined && params.col !== undefined){
            var x = params.col * self.tilesize,
                y = params.row * self.tilesize;
            css.transform = "translate(" + x + "px, " + y + "px)";
        }
        if (params.width && params.height){
            css.width = params.width;
            css.height = params.height;
        }
        self.selector.css(css);
    };

    var registerEvents = function(){
        var mouseDown = false,
            mouseOver = false,
            mouseRow = 0,
            mouseCol = 0,
            mousePos = ac.utils.getRelativeMousePosition;

        self.overlay
        .on('mousemove', function(event){
            var tsize, pos;
            if ( ! self.layers.length ) { return; }
            tsize = self.tilesize;
            pos = mousePos(self.container, tsize, event.pageX, event.pageY);
            mouseCol = pos.x;
            mouseRow = pos.y;
            updateCursor({row: mouseRow, col: mouseCol});
            if (mouseDown){
                // allow painting while dragging
                //getTool().mousemove(mouseRow, mouseCol);
            }
        })
        .on('mousedown', function(event){
            if ( ! self.layers.length ) { return; }
            event.preventDefault();
            //getTool().mousedown(mouseRow, mouseCol);
            mouseDown = true;
        })
        .on('mouseup', function(event){
            if ( ! self.layers.length ) { return; }
            //getTool().mouseup(mouseRow, mouseCol);
            mouseDown = false;
        })
        .on('mouseenter', function(){
            mouseOver = true;
            // TODO: create onselect  for palette to avoid this code below
            // if(getSelectedTiles()){
            //     self.selector.show();
            // }
        })
        .on('mouseleave', function(){
            mouseOver = false;
            self.selector.hide();
        });

        env.get("DOCUMENT")
        .on("tileSelectionEnd", function(){
            // event triggered when the mouse is released on palette selection
            if ( ! self.layers.length ) { return; }
            var selection = env.get("SELECTED_TILES");
            updateCursor({width: selection.width, height: selection.height});
            if (mouseOver){
                self.selector.show();
            }
        })
        .on("mouseup", function(event){
            mouseDown = false;
        })
        .on("layerChange", function(event){
            if ( ! self.layers.length ) { return; }
            showCurrentLayer();
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
