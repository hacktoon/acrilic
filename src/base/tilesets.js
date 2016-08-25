
ac.export("tilesets", function(env){
    "use strict";

    ac.import("tiles");

    var self = {
        tilesets: []
    };

    var Tileset = ac.Class({
        init: function(id, name, tilesize, image, map){
            this.id = id;
            this.name = name;
            this.tilesize = tilesize;
            this.tiles = this.buildTiles(map);
        },

        buildTiles: function(map) {
            var tsize = this.tilesize;
            var tiles = {};
            for(var i in map){
                var tile_map = map[i];
            }
        }

        getTile: function(id) {
            return this.tiles[id];
        }
    });

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
