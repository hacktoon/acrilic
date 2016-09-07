ac.export("tools", function(env){
    "use strict";

    ac.import("utils", "fill");

    var self = {};

    var inWhitelist = function(row, col, whitelist) {
        if(! whitelist){ return true; }
        if(whitelist[row + "," + col]){
            return true;
        }
        return false;
    };

    var applyPattern = function(map, row0, col0, toolArea, whitelist) {
        var pattern = env.get("TILE_PATTERN");
        for(var row=0; row < pattern.rows; row++){
            for(var col=0; col < pattern.cols; col++){
                var relRow = row + row0,
                    relCol = col + col0,
                    inRows = relRow >= toolArea.row0 && relRow <= toolArea.row1,
                    inCols = relCol >= toolArea.col0 && relCol <= toolArea.col1;
                if(inRows && inCols && inWhitelist(relRow, relCol, whitelist)){
                   map.set(relRow, relCol, pattern.submap[row][col]);
                }
            }
        }
    };

    var getGuidePoints = function(origRow, origCol, toolArea) {
        // return the start and end points for the pattern application
        var pattern = env.get("TILE_PATTERN"), startRow, startCol, endRow, endCol;
        startRow = origRow - Math.ceil((origRow - toolArea.row0) / pattern.rows) * pattern.rows;
        startCol = origCol - Math.ceil((origCol - toolArea.col0) / pattern.cols) * pattern.cols;
        endRow = origRow + Math.ceil((toolArea.row1 - origRow) / pattern.rows) * pattern.rows;
        endCol = origCol + Math.ceil((toolArea.col1 - origCol) / pattern.cols) * pattern.cols;

        return {startRow: startRow, startCol: startCol, endRow: endRow, endCol: endCol};
    };

    var applyPatternToArea = function(map, origRow, origCol, toolArea, whitelist) {
        var pattern = env.get("TILE_PATTERN"),
            guidePoints = getGuidePoints(origRow, origCol, toolArea);
        for(var row=guidePoints.startRow; row<=guidePoints.endRow; row+=pattern.rows){
            for(var col=guidePoints.startCol; col<=guidePoints.endCol; col+=pattern.cols){
                applyPattern(map, row, col, toolArea, whitelist);
            }
        }
    };

    self.pen = (function(){
        var penAction = function functionName(map, row, col) {
            var pattern = env.get("TILE_PATTERN"),
                toolArea = {
                    row0: row,
                    col0: col,
                    row1: row+pattern.rows-1,
                    col1: col+pattern.cols-1
                };
            applyPattern(map, row, col, toolArea);
        };

        return {
            mousedown: penAction,
            drag: penAction,
            mutableCursor: true
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
            },
            mutableCursor: false
        };
    })();

    self.fill = (function(){
        var floodFill = function(map, row, col, origTile, visited) {
            var key = row+","+col;
            var tile = map.get(row, col);
            if (!tile || visited[key] || tile.id != origTile.id){
                return;
            }
            visited[key] = true;
            floodFill(map, row+1, col, origTile, visited);
            floodFill(map, row-1, col, origTile, visited);
            floodFill(map, row, col+1, origTile, visited);
            floodFill(map, row, col-1, origTile, visited);
        };

        var calcToolArea = function(map, visited) {
            var row0, col0, row1, col1;
            for(var key in visited){
                var point = key.split(",");
                var row = Number(point[0]),
                    col = Number(point[1]);
                row0 = Math.min(row0 || row, row);
                col0 = Math.min(col0 || col, col);
                row1 = Math.max(row1 || row, row);
                col1 = Math.max(col1 || col, col);
            }
            return {row0: row0, col0: col0, row1: row1, col1: col1};
        };

        return {
            mousedown: function(map, row, col) {
                var visited = {};
                var toolArea;
                floodFill(map, row, col, map.get(row, col), visited);
                toolArea = calcToolArea(map, visited);
                applyPatternToArea(map, row, col, toolArea, visited);
            },
            drag: function() {},
            mutableCursor: false
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
