
ac.export("tilesets", function(env){
    "use strict";

    ac.import("tiles");

    var self = {
        tilesets: []
    };

    var Tileset = ac.Class({
        init: function(id, tilesize, image){
            this.id = id;
            this.tilesize = tilesize;
            this.tiles = {};
        }
    });

    var createTileset = function(tilesetData){
        var tileset = new Tileset(id, tilesize, image);
        self.tilesets.push(tileset);
        return tileset;
    };

    return {
        createTileset: createTileset
    };
});
