
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "display", "tools");

    var self = {
        container: $("#board"),
        overlay: $("#board-overlay"),
        selector: $("#board-selector"),
        initialized: false,
        tileset: undefined,
        map: undefined,
        tool: undefined,
        mouse: {
            down: false,
            over: false,
            ready: true,
            row: 0,
            col: 0
        }
    };

    var updateSelector = function(){
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
        updateSelector();
    };

    var tileSelectionEndEvent = function(){
        self.mouse.ready = true;
        updateSelector();
    };

    var registerEvents = function(){
        if(self.initialized) { return; }
        self.initialized = true;

        self.overlay
        .on("mouseenter", function(){ self.mouse.over = true; })
        .on("mouseleave", function(){ self.mouse.over = false; })
        .on('mousedown',  function(){ mouseDownEvent(); });

        ac.document
        .on("mouseup",            function(e){ self.mouse.down = false; })
        .on('mousemove',          function(e){ mouseMoveEvent(e); })
        .on("tileSelectionStart", function(e){ self.mouse.ready = false; })
        .on("tileSelectionEnd",   function(e){ tileSelectionEndEvent(); })
        .on("toolChange",         function(e){ self.tool = ac.tools.getTool(); });
    };

    var loadFile = function(map, tileset){
        var tilesize = tileset.tilesize,
            width = map.cols * tilesize,
            height = map.rows * tilesize,
            display = ac.display.createDisplay(width, height, map, tileset);

        self.map = map;
        self.tileset = tileset;
        self.tool = ac.tools.getTool();
        self.selector.css({width: tilesize, height: tilesize});
        self.overlay.css({width: width, height: height});
        self.container.html(display).css({width: width, height: height});

        registerEvents();
    };

    return {
        loadFile: loadFile
    };
});
