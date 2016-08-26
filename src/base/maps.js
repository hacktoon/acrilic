
ac.export("maps", function(env){
    "use strict";

    ac.import("utils");

    /*
    The Map is a tridimensional array of tiles, in which each cell contains a Tile object id
    */
    var Map = ac.Class({
        init: function(rows, cols, nullTileID){
            this.rows = rows;
            this.cols = cols;
            this.grids = [
                ac.utils.build2DArray(rows, cols, nullTileID),  // BG Layer
                ac.utils.build2DArray(rows, cols, nullTileID),  // FG Layer
                ac.utils.build2DArray(rows, cols, nullTileID)   // Event Layer
            ];
        },

        inRange: function(row, col) {
            var col_range = col >= 0 && col < this.cols,
                row_range = row >= 0 && row < this.rows;
            return col_range && row_range;
        },

        currentGrid: function(){
            var layer = env.get("CURRENT_LAYER");
            return this.grids[layer];
        },

        set: function(row, col, tile){
            if (! this.inRange(row, col)) { return; }
            this.currentGrid()[row][col] = tile;
        },

        get: function(row, col){
            if (! this.inRange(row, col)) { return; }
            return this.currentGrid()[row][col];
        },

        toJSON: function(){
            return {
                rows: this.rows,
                cols: this.cols,
                grids: this.grids
            };
        }
    });

    var createMap = function(rows, cols){
        return new Map(rows, cols, 0);
    };

    var createMapFrom = function(mapData){
        var map = createMap(mapData.rows, mapData.cols);
        mapData.grids.forEach(function(grid, i) {
            map.grids[i] = grid;
        });
        return map;
    };

    return {
        createMapFrom: createMapFrom,
        createMap: createMap
    };
});
