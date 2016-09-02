ac.export("tools", function(env){
    "use strict";

    ac.import("utils", "fill");

    var self = {};

    var insideArea = function(row, col, renderPoints) {

    };

    var repeat = function(times, func) {
        for(var i=0; i<times; i++){
            func();
        }
    };

    var renderPattern = function(map, row0, col0, whitelist) {
        var pattern = env.get("TILE_PATTERN"),
            rows = pattern.rows,
            cols = pattern.cols;
        for(var row=0; row < rows; row++){
            for(var col=0; col < cols; col++){
                var tile = pattern.submap[row][col];
                map.set(row + row0, col + col0, tile);
            }
        }
    };

    var getRenderPoints = function(origRow, origCol, toolArea) {
        // return the origin point to start rendering the pattern and how many times per col/row
        var pattern = env.get("TILE_PATTERN"),
            row = origRow,
            col = origCol,
            loopRows = Math.ceil((toolArea.row1 - toolArea.row0 + 1) / pattern.rows),
            loopCols = Math.ceil((toolArea.col1 - toolArea.col0 + 1) / pattern.cols);
        while(row > toolArea.row0 - pattern.rows){ row -= pattern.rows; }
        while(col > toolArea.col0 - pattern.cols){ col -= pattern.cols; }
        return {row0: row, col0: col, loopRows: loopRows, loopCols: loopCols};
    };

    var renderPatternArea = function(map, origRow, origCol, toolArea) {
        var pattern = env.get("TILE_PATTERN"),
            renderPoints = getRenderPoints(origRow, origCol, toolArea);

        for(var row=1; row<=renderPoints.loopRows; row++){
            for(var col=1; col<=renderPoints.loopCols; col++){
                var row0 = row * pattern.rows,
                    col0 = col * pattern.cols;
                renderPattern(map, row0, col0, renderPoints);
            }
        }
    };

    self.pen = (function(){
        return {
            mousedown: renderPattern,
            drag: renderPattern
        };
    })();

    self.square = (function(){
        var origRow, origCol, toolArea;
        return {
            mousedown: function(map, row, col) {
                toolArea = {row0: row, col0: col, row1: row, col1: col};
                origRow = row;
                origCol = col;
                renderPatternArea(map, row, col, toolArea);
                map.saveState();
            },
            drag: function(map, row1, col1) {
                var abs = ac.utils.absCoordinates(origRow, origCol, row1, col1);
                toolArea = {
                    row0: abs.row0,
                    col0: abs.col0,
                    row1: abs.row1,
                    col1: abs.col1
                };
                map.restoreState();
                renderPatternArea(map, origRow, origCol, toolArea);
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
            renderPatternArea(map, row, col);
            floodFill(map, row+1, col);
            floodFill(map, row-1, col);
            floodFill(map, row, col+1);
            floodFill(map, row, col-1);
        };

        return {
            mousedown: function(map, row, col) {
                var origTile = map.get(row, col);
                visited = [];
                floodFill(map, row, col, origTile);
            },
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
