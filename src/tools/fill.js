ac.export("fill", function(env){
    "use strict";

    var _self = {
        visited: []
    };

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

    var floodFill = function(map, row, col, original_color) {
        
    };

    var execute = function(map, row, col, selection) {
        var orig_tile_id = map.get(row, col);
        _self.visited = [];
        floodFill(map, row, col, orig_tile_id);
    };

    return {
        execute: execute
    };
});
