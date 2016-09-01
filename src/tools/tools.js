ac.export("tools", function(env){
    "use strict";

    ac.import("fill", "tilesets");

    var self = {};

    var updateTile = function(map, row0, col0, mask) {
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
            mousedown: updateTile,
            mouseup: function() {},
            drag: updateTile
        };
    })();

    self.square = (function(){
        var row0,
            col0;
        return {
            mousedown: function(map, row, col) {
                row0 = row;
                col0 = col;
                map.backup();
            },
            mouseup: function(map, row, col) {
                var rel_row0 = Math.min(row0, row),
                    rel_row1 = Math.max(row0, row),
                    rel_col0 = Math.min(col0, col),
                    rel_col1 = Math.max(col0, col);
                for(var row=rel_row0; row<=rel_row1; row++){
                    for(var col=rel_col0; col<=rel_col1; col++){
                        updateTile(map, row, col);
                    }
                }
            },
            drag: function(map, row, col) {
                prevSubmap = ac.utils.build2DArray(row-row0+1, col-col0+1);
                this.mouseup(map, row, col);
            }
        };
    })();

    self.fill = (function(){
        var visited = [];
        var getAdjacentCells = function(map, row, col) {
            var valid_cells = [],
                cells = [
                    [row+1, col],
                    [row-1, col],
                    [row, col+1],
                    [row, col-1]
                ];

            for(var i=0; i<cells.length; i++){
                var cell = cells[i];
                if(! map.get(cell[0], cell[1])){
                    continue;
                }
                valid_cells.push(cell);
            }
            return valid_cells;
        };

        var floodFill = function(map, row, col, origTileID) {
            updateTile(map, row, col);
            floodFill(map, row+1, col);
            floodFill(map, row-1, col);
            floodFill(map, row, col+1);
            floodFill(map, row, col-1);
        };

        return {
            mousedown: function(map, row, col) {
                var origTileID = map.get(row, col);
                visited = [];
                floodFill(map, row, col, origTileID);
            },
            mouseup: function() {},
            drag: function() {}
        }
    })();

    var getTool = function() {
        var tool = env.get("CURRENT_TOOL");
        return self[tool] || self.pen;
    };

    return {
        getTool: getTool
    };
});
