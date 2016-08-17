ac.export("tools", function(env){
    "use strict";

    ac.import("fill");

    var _self = {
        current: undefined,
        tools: {}
    };

    var updateTile = function(row, col, boardData) {
        var tsize = env.get("TILESIZE"),
            selection = boardData.selection,
            layer = boardData.layer,
            x = col * tsize,
            y = row * tsize;
        // update the layers with the new tile image
        layer.update(selection.image, x, y);
        // update the map grid with the new tile ids
        boardData.map.update(layer.index, row, col, selection.submap);
    };

    var pen = (function(){
        return {
            mousedown: function(row, col, boardData) {
                updateTile(row, col, boardData);
            },
            mousemove: function(row, col, boardData) {
                updateTile(row, col, boardData);
            },
            mouseup: function() {}
        };
    })();

    var square = (function(){
        var row0, col0;
        return {
            mousedown: function(row, col, boardData) {
                row0 = row;
                col0 = col;
            },
            mousemove: function(row1, col1, boardData) {
                updateTile(row1, col1, boardData);
            },
            mouseup: function() {
                row0 = undefined;
                col0 = undefined;
            }
        };
    })();

    var fill = {
        mousedown: function(row, col, boardData) {
            return ac.fill.execute(row, col, boardData);
        },
        mousemove: function() {},
        mouseup: function() {}
    };

    var setTool = function(func) {
        _self.current = func;
    };

    var getCurrentTool = function() {
        return _self.tools[_self.current];
    };

    var initTools = function() {
        _self.tools = {
            pen: pen,
            square: square,
            fill: fill
        };
    };

    return {
        initTools: initTools,
        getCurrentTool: getCurrentTool,
        setTool: setTool
    };
});
