
ac.export("tileset", function(env){
    "use strict";

    ac.import("utils");
    ac.import("canvas");

    var Tileset = ac.Class({
        init: function(rows, columns){
            this.tile_id = 1;
            this.rows = rows;
            this.columns = columns;
            this.tile_grid = ac.utils.build2DArray(rows, columns);
            this.tile_map = {};
        },

        createTile: function(row, col, canvas) {
            var tile = new Tile(this.tile_id, canvas);
            this.tile_map[this.tile_id] = tile;
            this.tile_grid[row][col] = tile;
            this.tile_id++;
        },

        getTileById: function(id) {
            return this.tile_map[id];
        },

        getTileByPosition: function(row, col) {
            return this.tile_grid[row][col];
        }
    });

    var Tile = ac.Class({
        init: function(id, canvas){
            this.id = id;
            this.canvas = canvas;
        },

        getCanvas: function() {
            return this.canvas.elem.get(0);
        }
    });

    var createTileset = function(tileset){
        var image = tileset.image,
            tilesize = tileset.tilesize,
            columns = Math.floor(image.width / tilesize),
            rows = Math.floor(image.height / tilesize),
            tileset = new Tileset(rows, columns);

        env.set("TILESIZE", tilesize);

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < columns; col++) {
                var canvas = ac.canvas.createCanvas(tilesize, tilesize);
                canvas.draw(image, col*tilesize, row*tilesize, 0, 0);
                tileset.createTile(row, col, canvas);
            }
        }
        return tileset;
    };

    return {
        createTileset: createTileset
    };
});
