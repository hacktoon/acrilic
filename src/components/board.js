
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "tilesets");

    var self = {
        container: $("#board"),
        overlay: undefined,
        cursor: undefined,
        currentFile: undefined,
        tilesize: 0
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
        self.cursor.css(css);
    };

    var registerEvents = function(){
        var mouseDown = false,
            mouseOver = false,
            mouseRow = 0,
            mouseCol = 0;

        self.overlay
        .on('mousemove', function(event){
            var pos = ac.utils.getRelativeMousePosition(event, self.container);
            mouseCol = pos.x;
            mouseRow = pos.y;
            updateCursor({row: mouseRow, col: mouseCol});
            if (mouseDown){
                // allow painting while dragging
                getTool().mousemove(mouseRow, mouseCol);
            }
        })
        .on('mousedown', function(event){
            event.preventDefault();
            getTool().mousedown(mouseRow, mouseCol);
            mouseDown = true;
        })
        .on('mouseup', function(event){
            getTool().mouseup(mouseRow, mouseCol);
            mouseDown = false;
            saveMap();
        })
        .on('mouseenter', function(){
            mouseOver = true;
            // TODO: create onselect  for palette to avoid this code below
            // if(getSelectedTiles()){
            //     self.cursor.show();
            // }
        })
        .on('mouseleave', function(){
            mouseOver = false;
            self.cursor.hide();
        });

        env.get("DOCUMENT")
        .on("selectionready", function(){
            // event triggered when the mouse is released on palette selection
            var selection = getSelectedTiles();
            updateCursor({width: selection.width, height: selection.height});
            if (mouseOver){
                self.cursor.show();
            }
        })
        .on('mouseup', function(event){
            mouseDown = false;
        });
    };

    var createLayers = function() {

    };

    var createElements = function(map) {
        self.overlay = $("<div/>").addClass("board-overlay").append(self.cursor);
        self.cursor = $("<div/>").addClass("selection-cursor").hide();
        self.container.html(self.overlay);
    };

    var loadFile = function(file){
        self.tilesize = env.get("TILESIZE");
        var width = file.map.cols * self.tilesize,
            height = file.map.rows * self.tilesize;
        self.cursor.css({width: self.tilesize, height: self.tilesize})
        self.overlay.css({width: width, height: height});
        self.currentFile = file;
    };

    var init = function(){
        createElements();
        registerEvents();
    };

    return {
        init: init,
        loadFile: loadFile
    };
});
