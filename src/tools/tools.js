ac.export("tools", function(env){
    "use strict";

    ac.import("utils", "fill");

    var self = {};

    var updateMap = function(map, row0, col0, mask) {
        var selection = env.get("SELECTED_TILES");
        for(var row=0; row<selection.rows; row++){
            for(var col=0; col<selection.cols; col++){
                var tile = selection.submap[row][col],
                    relRow = row + row0,
                    relCol = col + col0,
                    currentTile = map.get(relRow, relCol);

                map.set(relRow, relCol, tile);
            }
        }
    };

    self.pen = (function(){
        return {
            mousedown: updateMap,
            mouseup: function() {},
            drag: updateMap
        };
    })();

    self.square = (function(){
        var row0,
            col0;
        return {
            mousedown: function(map, row, col) {
                row0 = row;
                col0 = col;
                //map.saveState();
            },
            mouseup: function() {},
            drag: function(map, row, col) {
                var abs = ac.utils.absCoordinates(row0, col0, row, col);
                //map.restoreState();
                for(var row=abs.row0; row<=abs.row1; row++){
                    for(var col=abs.col0; col<=abs.col1; col++){
                        updateMap(map, row, col);
                    }
                }
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
            updateMap(map, row, col);
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
