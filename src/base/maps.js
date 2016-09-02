
ac.export("maps", function(env){
    "use strict";

    ac.import("utils");

    /*
    The Map is a tridimensional array of tiles, in which each cell contains a Tile object id
    TODO: add setWalk method
    */
    var Map = ac.Class({
        init: function(rows, cols, defaultTile){
            this.rows = rows;
            this.cols = cols;
            this.grids = ac.data.layers.map(function(){
                return ac.utils.build2DArray(rows, cols, defaultTile);
            });
            this.walk = ac.utils.build2DArray(rows, cols, 0);
            this.state = undefined;
        },

        inRange: function(row, col) {
            var colRange = col >= 0 && col < this.cols,
                rowRange = row >= 0 && row < this.rows;
            return colRange && rowRange;
        },

        set: function(row, col, tile, layerID){
            var layerID = layerID || env.get("CURRENT_LAYER");
            if (this.get(row, col).id == tile.id || ! this.inRange(row, col)){
                return;
            }
            this.grids[layerID][row][col] = tile;
            this.walk[row][col] = tile.walk;
            env.set("MODIFIED_CELL", {row: row, col: col});
            ac.document.trigger("mapChange");
        },

        get: function(row, col, layerID){
            var layerID = layerID || env.get("CURRENT_LAYER");
            if (! this.inRange(row, col)) { return; }
            return this.grids[layerID][row][col];
        },

        saveState: function() {
            var layerID = env.get("CURRENT_LAYER");
            this.state = ac.utils.copy2DArray(this.grids[layerID]);
        },

        restoreState: function() {
            for(var row=0; row<this.rows; row++){
                for(var col=0; col<this.cols; col++){
                    this.set(row, col, this.state[row][col]);
                }
            }
        },

        toJSON: function(){
            return {
                rows: this.rows,
                cols: this.cols,
                grids: this.grids.map(function(tileGrid){
                    var grid = ac.utils.build2DArray(this.rows, this.cols);
                    for(var row=0; row<this.rows; row++){
                        for(var col=0; col<this.cols; col++){
                            grid[row][col] = tileGrid[row][col].id;
                        }
                    }
                    return grid;
                }.bind(this)),
                walk: this.walk
            };
        }
    });

    var createMap = function(rows, cols, defaultTile){
        return new Map(rows, cols, defaultTile);
    };

    var createMapFrom = function(mapData){
        var map = createMap(mapData.rows, mapData.cols);
        mapData.grids.forEach(function(grid, i) {
            map.grids[i] = grid;
        });
        map.walk = mapData.walk;
        return map;
    };

    return {
        createMapFrom: createMapFrom,
        createMap: createMap
    };
});
