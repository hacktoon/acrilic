ac.export("tools", function(env){
    "use strict";

    ac.import("fill", "tilesets");

    var self = {};

    var updateTile = function(map, row0, col0) {
        var selection = env.get("SELECTED_TILES");
        var modifiedCells = [];
        for(var row=0; row<selection.rows; row++){
            for(var col=0; col<selection.cols; col++){
                var tile = selection.submap[row][col],
                    relRow = row + row0,
                    relCol = col + col0,
                    currentTile = map.get(relRow, relCol);

                if (currentTile != tile){
                    map.set(relRow, relCol, tile);
                    modifiedCells.push({row: relRow, col: relCol});
                }
            }
        }
        env.set("MODIFIED_CELLS", modifiedCells);
        ac.document.trigger("mapChange");
    };

    self.pen = (function(){
        return {
            click: updateTile,
            drag: updateTile
        };
    })();

    self.square = (function(){
        var row0, col0;
        return {
            click: function(map, row, col) {
                row0 = row;
                col0 = col;
                updateTile(map, row, col);
            },
            drag: function(map, row1, col1) {
                var rel_row0 = Math.min(row0, row1),
                    rel_row1 = Math.max(row0, row1),
                    rel_col0 = Math.min(col0, col1),
                    rel_col1 = Math.max(col0, col1);
                for(var row=rel_row0; row<=rel_row1; row++){
                    for(var col=rel_col0; col<=rel_col1; col++){
                        updateTile(map, row, col);
                    }
                }
            }
        };
    })();

    self.fill = {
        click: function(map, row, col) {
            return ac.fill.execute(row, col);
        },
        drag: function() {}
    };

    var getTool = function() {
        var tool = env.get("CURRENT_TOOL");
        return self[tool] || self.pen;
    };

    return {
        getTool: getTool
    };
});
