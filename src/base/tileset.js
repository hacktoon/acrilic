
ac.export("tileset", function(env){
    "use strict";

    ac.import("utils", "tiles");

    var _self = {
        tilesets: []
    };

    var getDefaultTileset = function() {
        // tile com id 0 e imagem transparente
        // return tile vazio
    }

    var Tileset = ac.Class({
        init: function(id, tilesize, image){
            this.id = id;
            this.tilesize = tilesize;
            this.tiles = {};
        }
    });

    var createTileset = function(id, image ){
        var tileset = new Tileset(id, image);
        return tileset;
    };

    return {
        createTileset: createTileset
    };
});
