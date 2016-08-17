ac.export("tools", function(env){
    "use strict";

    ac.import("fill");

    var _self = {
        current: undefined,
        tools: {}
    };

    var pen = (function(){

        var updateTile = function(row, col, boardData) {
            var tsize = env.get("TILESIZE"),
                selection = boardData.selection,
                layer = boardData.layer,
                x = col * tsize,
                y = row * tsize;
            // update the layers with the new tile image
            ac.layer.updateLayer(layer, x, y, selection.image);
            // update the map grid with the new tile ids
            boardData.map.update(layer, row, col, selection.submap);
        };

        return {
            mousedown: function(row, col, boardData) {
                updateTile(row, col, boardData);
            },
            mouseup: function() {}
        };
    })();

    var square = {
        mousedown: function(map, row, col) {
            return [{row:row, col:col}];
        },
        mouseup: function(map, row, col) {
            return [{row:row, col:col}];
        }
    };

    var fill = {
        mousedown: function(map, row, col) {
            return ac.fill.execute(map, row, col);
        },
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
