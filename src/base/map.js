
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

        update: function(layerIndex, tileRow, tileCol, submap) {
            ac.utils.iterate2DArray(submap, function(subrow, subcol) {
                var row = subrow + tileRow,
                    col = subcol + tileCol;

                if (! this.inRange(row, col)) { return; }
                this.set(layerIndex, row, col, submap[subrow][subcol]);
            }.bind(this));
        },

        inRange: function(row, col) {
            var col_range = col >= 0 && col < this.cols,
                row_range = row >= 0 && row < this.rows;
            return col_range && row_range;
        },

        getLayer: function(layerIndex) {
            return this.layers[layerIndex || 0];
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
