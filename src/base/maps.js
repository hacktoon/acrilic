
ac.export("maps", function(env){
    "use strict";

    ac.import("utils");

    var Matrix = ac.Class({
        init: function(rows, cols, defaultValue){
            this.matrix = ac.utils.build2DArray(rows, cols, defaultValue);
        },

        set: function(row, col, value){
            if (! this.inRange(row, col)) { return; }
            this.matrix[row][col] = value;
        },

        get: function(row, col){
            if (! this.inRange(row, col)) { return; }
            return this.matrix[row][col];
        },

        inRange: function(row, col) {
            var col_range = col >= 0 && col < this.cols,
                row_range = row >= 0 && row < this.rows;
            return col_range && row_range;
        }
    });

    /*
    A Map of int values pointing to tiles in a tileset
    */
    var Map = ac.Class({
        init: function(rows, cols){
            this.rows = rows;
            this.cols = cols;
            this.matrices = [
                new Matrix(rows, cols, 0),  // BG Layer
                new Matrix(rows, cols, 0),  // FG Layer
                new Matrix(rows, cols, 0)   // Event Layer
            ];
        },

        set: function(row, col, tile){
            var layer = env.get("CURRENT_LAYER");
            this.matrices[layer].set(row, col, tile);
        },

        get: function(row, col){
            var layer = env.get("CURRENT_LAYER"),
            return this.matrices[layer].get(row, col);
        }
    });

    var create = function(name, rows, cols){
        return new Map(name, rows, cols);
    };

    var createFrom = function(mapData) {
        var map = create(mapData.name, mapData.rows, mapData.cols);
        mapData.matrices.forEach(function(matrix, i) {
            map.matrices[i] = matrix;
        });
        return map;
    };

    return {
        createFrom: createFrom,
        create: create
    };
});
