
ac.export("board", function(env){
    "use strict";

    ac.import("utils", "map", "palette", "tools", "fs");

    var _self = {
        doc: $(document),
        container: $("#board-panel"),
        overlay: undefined,
        cursor: undefined
    };

    var updateCursor = function(params){
        var tsize = env.get("TILESIZE"),
            css = {};
        if (params.row !== undefined && params.col !== undefined){
            var x = params.col * tsize,
                y = params.row * tsize;
            css.transform = "translate(" + x + "px, " + y + "px)";
        }
        if (params.width && params.height){
            css.width = params.width;
            css.height = params.height;
        }
        _self.cursor.css(css);
    };

    var getSelection = function(){
        return ac.palette.getSelection();
    };

    var getTool = function(){
        return ac.tools.getCurrentTool();
    };

    var getBoardData = function(){
        return {
            map: _self.currentMap,
            selection: getSelection(),
            layer: _self.layers[_self.currentLayer]
        };
    };

    var registerEvents = function(){
        var mouseDown = false,
            mouseOver = true,
            mouseRow = 0,
            mouseCol = 0;

        _self.overlay
        .on('mousemove', function(event){
            var pos = ac.utils.getRelativeMousePosition(event, _self.container);
            mouseCol = pos.x;
            mouseRow = pos.y;
            updateCursor({row: mouseRow, col: mouseCol});
            if (mouseDown){
                // allow painting while dragging
                getTool().mousemove(mouseRow, mouseCol, getBoardData());
            }
        })
        .on('mousedown', function(event){
            event.preventDefault();
            getTool().mousedown(mouseRow, mouseCol, getBoardData());
            mouseDown = true;
        })
        .on('mouseup', function(event){
            getTool().mouseup(mouseRow, mouseCol, getBoardData());
            mouseDown = false;
        })
        .on('mouseenter', function(){
            mouseOver = true;
            if(getSelection()){
                _self.cursor.show();
            }
        })
        .on('mouseleave', function(){
            mouseOver = false;
            _self.cursor.hide();
        });

        _self.doc
        .on("selectionready", function(){
            // event triggered when the mouse is released on palette selection
            var selection = getSelection();
            updateCursor({width: selection.width, height: selection.height});
            if (mouseOver){
                _self.cursor.show();
            }
        })
        .on('mouseup', function(event){
            mouseDown = false;
            saveMap();
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

    var createElements = function(map) {
        var tsize = env.get("TILESIZE"),
            width = map.cols * tsize,
            height = map.rows * tsize,
            board = $('<div/>').addClass('board'),
            overlay = $("<div/>").addClass("board-overlay")
                .css({width: width, height: height});
        board.width(width).height(height);
        _self.cursor = createCursor();
        _self.overlay = overlay.append(_self.cursor);
        _self.container.html([board, overlay]);
    };

    var saveMap = function() {
        var map = _self.currentMap;
        ac.fs.saveFile(map.name, ac.map.exportMap(map));
    };

    var createBoard = function(map){
        createElements(map);
        registerEvents();
        saveMap();
    };

    return {
        createBoard: createBoard
    };
});
