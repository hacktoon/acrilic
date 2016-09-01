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
                for(var row=row0; row<=row1; row++){
                    for(var col=col0; col<=col1; col++){
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
