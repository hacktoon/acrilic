
ac.export("map", function(env){
    "use strict";

    ac.import("utils", "canvas");

    var _self = {
    };

    var Layer = ac.Class({
        init: function(index, id, width, height){
            this.index = index;
            this.id = id;
            this.canvas = ac.canvas.createCanvas(width, height);
            this.canvas.elem.attr("id", id).addClass('layer');
        },

        update: function(image, x, y){
            this.canvas.clear(x, y, image.width, image.height);
            this.canvas.draw(image, 0, 0, x, y);
        },

        getElement: function(){
            return this.canvas.elem;
        },

        activate: function(){
            this.canvas.elem.addClass("active");
        },

        deactivate: function(){
            this.canvas.elem.removeClass("active");
        }
    });

    var Map = ac.Class({
        init: function(name, rows, cols){
            this.name = name;
            this.rows = rows;
            this.cols = cols;
            this.currentLayer = 0;
            this.layers = [
                ac.utils.build2DArray(rows, cols, 0),  // BG Layer
                ac.utils.build2DArray(rows, cols, 0),  // FG Layer
                ac.utils.build2DArray(rows, cols, {})  // Event Layer
            ];
        },

        createLayers: function(width, height){
            var layers = [
                new Layer(0, "bg-layer", width, height),
                new Layer(1, "fg-layer", width, height),
                new Layer(2, "evt-layer", width, height)
            ];
            return ac.utils.map(_self.layers, function(layer){
                return layer.getElement();
            });
        },

        set: function(row, col, value){
            this.layers[layerIndex][row][col] = value;
        },

        get: function(row, col){
            return this.layers[layerIndex][row][col];
        },

        setRegion: function(tileRow, tileCol, submap) {
            ac.utils.iterate2DArray(submap, function(subrow, subcol) {
                var row = subrow + tileRow,
                    col = subcol + tileCol;

                if (! this.inRange(row, col)) { return; }
                this.set(layerIndex, row, col, submap[subrow][subcol]);
            }.bind(this));
        },

        getRegion: function(row0, col0, row1, col1) {

        },

        inRange: function(row, col) {
            var col_range = col >= 0 && col < this.cols,
                row_range = row >= 0 && row < this.rows;
            return col_range && row_range;
        },

        getLayer: function(layerIndex) {
            return this.layers[layerIndex || 0];
        },

        activateLayer: function(index) {
            index = index || env.get("CURRENT_LAYER");
            this.layers[this.currentLayer].deactivate();
            this.currentLayer = index;
            this.layers[index].activate();
        },

        render: function() {
            var tsize = env.get("TILESIZE");

            //map.getLayer() is used here only to send a matrix with specific cols x rows
            ac.utils.iterate2DArray(this.getLayer(), function(row, col) {
                for(var layerIndex in _self.layers){
                    var tile_id = this.get(row, col),
                        tile = ac.palette.getTile(tile_id);
                    if (! tile){ continue; }
                    _self.layers[layerIndex].update(tile.getCanvas(), col*tsize, row*tsize);
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
