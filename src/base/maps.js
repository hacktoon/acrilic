
ac.export("maps", function(env){
    "use strict";

    ac.import("utils");

    var Grid = ac.Class({
        init: function(rows, cols, defaultValue){
            this.rows = rows;
            this.cols = cols;
            this.matrix = ac.utils.build2DArray(rows, cols, defaultValue);
        },

        inRange: function(row, col) {
            var colRange = col >= 0 && col < this.cols,
                rowRange = row >= 0 && row < this.rows;
            return colRange && rowRange;
        },

        set: function(row, col, value){
            if (! this.inRange(row, col)) { return; }
            this.matrix[row][col] = value;
        },

        get: function(row, col){
            if (! this.inRange(row, col)) { return; }
            return this.matrix[row][col];
        },

    });


    /*
    The Map is a tridimensional array of tiles, in which each cell contains a Tile object id
    TODO: add setWalk method
    */
    var Map = ac.Class({
        init: function(rows, cols, defaultValue){
            this.rows = rows;
            this.cols = cols;
            this.grids = ac.data.layers.map(function(){
                return new Grid(rows, cols, defaultValue);
            });
            this.walk = new Grid(rows, cols, 0);
        },

        set: function(row, col, tile){
            var layerID = env.get("CURRENT_LAYER");
            if (this.get(row, col) == tile.id){
                return;
            }
            this.grids[layerID].set(row, col, tile.id);
            this.walk.set(row, col, tile.walk);
            env.set("MODIFIED_CELL", {row: row, col: col});
            ac.document.trigger("mapChange");
        },

        get: function(row, col){
            var layerID = env.get("CURRENT_LAYER");
            return this.grids[layerID].get(row, col);
        },

        toJSON: function(){
            return {
                rows: this.rows,
                cols: this.cols,
                grids: this.grids.map(function(grid){ return grid.matrix }),
                walk: this.walk
            };
        }
    });

    var createMap = function(rows, cols, defaultValue){
        return new Map(rows, cols, defaultValue);
    };

    var createMapFrom = function(mapData){
        var map = createMap(mapData.rows, mapData.cols);
        mapData.grids.forEach(function(matrix, i) {
            map.grids[i].matrix = matrix;
        });
        map.walk = mapData.walk;
        return map;
    };

    return {
        createMapFrom: createMapFrom,
        createMap: createMap
    };
});
