
ac.export("tilesets", function(env){
    "use strict";

    ac.import("utils", "tiles");

    var self = {
        tilesets: {}
    };

    var Tileset = ac.Class({
        init: function(id, name, tilesize, image, tilemap){
            this.id = id;
            this.name = name;
            this.tiles = {};
            this.image = image;
            this.tilesize = tilesize;
            this.rows = image.height / tilesize;
            this.cols = image.width / tilesize;
            this.tilemap = ac.utils.build2DArray(this.rows, this.cols);

            for(var id in tilemap){
                var id = Number(id),
                    tileData = tilemap[id],
                    canvas = ac.utils.cropToCanvas(image, tilesize, tileData.col, tileData.row),
                    tile = ac.tiles.createTile(id, canvas, tileData.walk || 0);
                this.tiles[id] = tile;
                this.tilemap[tileData.row][tileData.col] = tile;
            }
        },

        getDefaultTile: function() {
            return this.tilemap[0][0];
        },

        getTileByID: function(id) {
            return this.tiles[id];
        },

        getTileByPosition: function(row, col) {
            return this.tilemap[row][col];
        }
    });

    var getTileset = function(id){
        return self.tilesets[id];
    };

    var init = function(tilesetSpecs){
        for(var i=0; i<tilesetSpecs.length; i++){
            var spec = tilesetSpecs[i];
            self.tilesets[spec.id] = new Tileset(
                spec.id,
                spec.name,
                spec.tilesize,
                spec.image,
                spec.tilemap
            );
        }
    };

    return {
        init: init,
        getTileset: getTileset
    };
});
