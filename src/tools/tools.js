ac.export("tools", function(env){
    "use strict";

    ac.import("utils", "fill");

    var self = {};

    var insideArea = function(row, col, renderPoints) {

    };

    var applyPattern = function(map, row0, col0, whitelist) {
        var pattern = env.get("TILE_PATTERN");
        for(var row=0; row < pattern.rows; row++){
            for(var col=0; col < pattern.cols; col++){
                map.set(row + row0, col + col0, pattern.submap[row][col]);
            }
        }
    };

    var getGuidePoints = function(origRow, origCol, toolArea) {
        // return the start and end points for the pattern rendering
        var pattern = env.get("TILE_PATTERN"), startRow, startCol, endRow, endCol;
        startRow = origRow - Math.ceil((origRow - toolArea.row0) / pattern.rows) * pattern.rows;
        startCol = origCol - Math.ceil((origCol - toolArea.col0) / pattern.cols) * pattern.cols;
        endRow = origRow + Math.floor((toolArea.row1 - origRow) / pattern.rows) * pattern.rows;
        endCol = origCol + Math.floor((toolArea.col1 - origCol) / pattern.cols)  * pattern.cols;

        return {startRow: startRow, startCol: startCol, endRow: endRow, endCol: endCol};
    };

    var applyPatternToArea = function(map, origRow, origCol, toolArea) {
        var pattern = env.get("TILE_PATTERN"),
            guidePoints = getGuidePoints(origRow, origCol, toolArea);
        for(var row=guidePoints.startRow; row<=guidePoints.endRow; row+=pattern.rows){
            for(var col=guidePoints.startCol; col<=guidePoints.endCol; col+=pattern.cols){
                applyPattern(map, row, col);
            }
        }
    };

    self.pen = (function(){
        return {
            mousedown: applyPattern,
            drag: applyPattern
        };
    })();

    self.square = (function(){
        var origRow, origCol, toolArea;
        return {
            mousedown: function(map, row, col) {
                toolArea = {row0: row, col0: col, row1: row, col1: col};
                origRow = row;
                origCol = col;
                applyPatternToArea(map, row, col, toolArea);
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
                applyPatternToArea(map, origRow, origCol, toolArea);
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
            applyPatternToArea(map, row, col);
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
