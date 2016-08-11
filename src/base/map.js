
ac.export("map", function(env){
    "use strict";

    ac.import("utils");

    var Map = ac.Class({
        init: function(name, rows, cols){
            this.name = name;
            this.rows = rows;
            this.cols = cols;
            this.layers = [
                ac.utils.build2DArray(rows, cols, 0),  // BG Layer
                ac.utils.build2DArray(rows, cols, 0),  // FG Layer
                ac.utils.build2DArray(rows, cols, {})  // Event Layer
            ];
        },

        set: function(layerIndex, row, col, value){
            this.layers[layerIndex][row][col] = value;
        },

        get: function(layerIndex, row, col){
            return this.layers[layerIndex][row][col];
        },

        inRange: function(row, col) {
            var col_range = col >= 0 || col < this.cols,
                row_range = row >= 0 || row < this.rows;
            return col_range && row_range;
        },

        update: function(row, col, region) {
            var matrix = selection.matrix,
                tool = $tools.getTool();

            tool(map, orig_row, orig_col, selection).forEach(function(tile){
                var col = tile.col,
                    row = tile.row;

                // update the map grid with the new tile ids
                for(var i=0; i<matrix.length; i++){
                    for(var j=0; j<matrix[i].length; j++){
                        var cell = map.get(i+row, j+col) || {};
                        cell[current_layer_id] = matrix[i][j];
                        map.set(i+row, j+col, cell);
                    }
                }
            });
        }
    });

    var createMap = function(name, rows, cols){
        return new Map(name, rows, cols);
    };

    var importMap = function(mapData) {
        var map = new Map(mapData.name, mapData.rows, mapData.cols);
        mapData.layers.forEach(function(layer, i) {
            map.layers[i] = layer;
        });
        return map;
    };

    var exportMap = function(map) {
        return {
            name: map.name,
            cols: map.cols,
            rows: map.rows,
            tilesize: env.get("TILESIZE"),
            layers: map.layers
        };
    };

    return {
        exportMap: exportMap,
        importMap: importMap,
        createMap: createMap
    };
});
