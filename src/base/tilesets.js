
ac.export("tilesets", function(env){
    "use strict";

    ac.import("utils", "tiles");

    var self = {
        tilesets: {}
    };

    var Tileset = ac.Class({
        init: function(id, name, tilesize, image, positionMap){
            var rows = image.height / tilesize,
                cols = image.width / tilesize;
            this.id = id;
            this.name = name;
            this.image = image;
            this.tilesize = tilesize;
            this.tiles = {};
            this.positionMap = positionMap;
            this.tilemap = ac.utils.build2DArray(rows, cols);

            for(var id in positionMap){
                var pos = positionMap[id],
                    canvas = ac.utils.cropToCanvas(image, tilesize, pos[0], pos[1]),
                    tile = ac.tiles.createTile(id, canvas);
                this.tiles[id] = tile;
                this.tilemap[pos[1]][pos[0]] = tile;
            }
        },

        getTileByID: function(id) {
            return this.tiles[id];
        },

        getTileByPosition: function(row, col) {
            return this.tilemap[row][col];
        },

        getTilePosition: function(id) {
            return this.positionMap[id];
        }
    });

    var getTileset = function(id){
        return self.tilesets[id];
    };

    var init = function(tilesetSpecs){
        for(var i=0; i<tilesetSpecs.length; i++){
            var spec = tilesetSpecs[i],
                id = spec.id,
                name = spec.name,
                tilesize = spec.tilesize,
                image = spec.image,
                map = spec.map;

            self.tilesets[id] = new Tileset(id, name, tilesize, image, map);
        }
    };

    return {
        init: init,
        getTileset: getTileset
    };
});
