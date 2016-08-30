ac.export("tools", function(env){
    "use strict";

    ac.import("fill", "tilesets");

    var self = {};

    var updateTile = function(row0, col0, map) {
        var selection = env.get("SELECTED_TILES");
        var modifiedCells = [];
        for(var row=0; row<selection.rows; row++){
            for(var col=0; col<selection.cols; col++){
                var relRow = row + row0,
                    relCol = col + col0,
                    id = selection.submap[row][col];
                map.set(relRow, relCol, ac.tilesets.getTileByID(id));
                modifiedCells.push({row: relRow, col: relCol});
            }
        }
        return modifiedCells;
    };

    self.pen = (function(){
        return {
            mousedown: updateTile,
            drag: updateTile,
            mouseup: function() {}
        };
    })();

    self.square = (function(){
        var row0, col0;
        return {
            mousedown: function(row, col, map) {
                row0 = row;
                col0 = col;
            },
            drag: function(row1, col1) {
                updateTile(row1, col1);
            },
            mouseup: function() {
                row0 = undefined;
                col0 = undefined;
            }
        };
    })();

    self.fill = {
        mousedown: function(row, col, map) {
            return ac.fill.execute(row, col);
        },
        drag: function() {},
        mouseup: function() {}
    };

    var getTool = function() {
        var index = env.get("CURRENT_TOOL");
        return self[index];
    };

    return {
        getTool: getTool
    };
});
