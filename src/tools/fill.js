ac.export("fill", function(env){
    "use strict";

    var _self = {
        visited: []
    };

    var get_adjacent_cells = function(map, row, col) {
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

    var execute = function(map, row, col, selection) {
        var orig_tile_id = map.get(row, col);

    };

    return {
        execute: execute
    };
});
