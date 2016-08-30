
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "display", "tools");

    var self = {
        document: env.get("DOCUMENT"),
        container: $("#board"),
        overlay: $("#board-overlay"),
        selector: $("#board-selector"),
        tileset: undefined,
        map: undefined,
        tool: undefined,
        mouse: {
            down: false,
            over: false,
            ready: true,
            row: 0,
            col: 0
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
        self.mouse.down = true;
        self.tool.mousedown(self.mouse.row, self.mouse.col, self.map);
    };

    var mouseMoveEvent = function(e){
        var tsize = self.tileset.tilesize,
            pos = ac.utils.relativePosition(self.container, tsize, e.pageX, e.pageY);
        self.mouse.col = pos.col;
        self.mouse.row = pos.row;
        if (self.mouse.down && self.mouse.over){  // allow painting while dragging
            self.tool.drag(self.mouse.row, self.mouse.col, self.map);
        }
        updateSelector(self.mouse);
    };

    var tileSelectionEndEvent = function(){
        self.mouse.ready = true;
        updateSelector(self.mouse);
    };

    var registerEvents = function(){
        self.overlay
        .on("mouseenter", function(){ self.mouse.over = true; })
        .on("mouseleave", function(){ self.mouse.over = false; })
        .on('mousedown',  function(){ mouseDownEvent(); });

        self.document
        .on("mouseup",            function(e){ self.mouse.down = false; })
        .on('mousemove',          function(e){ mouseMoveEvent(e); })
        .on("tileSelectionStart", function(e){ self.mouse.ready = false; })
        .on("tileSelectionEnd",   function(e){ tileSelectionEndEvent(); })
        .on("toolChange",         function(e){ self.tool = ac.tools.getTool(); });
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
