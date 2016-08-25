
ac.export("tilesets", function(env){
    "use strict";

    ac.import("utils", "tiles");

    var self = {
        tilesets: []
    };

    var Tileset = ac.Class({
        init: function(id, name, tilesize, image, map){
            this.id = id;
            this.name = name;
            this.tilesize = tilesize;
            this.tiles = this.buildTiles(image, map);
        },

        createCanvas: function(image, x, y){
            var tsize = this.tilesize;
            var canvas = ac.utils.createCanvas(tsize, tsize);
            canvas.getContext("2d").drawImage(image, x*tsize, y*tsize, tsize, tsize, 0, 0, tsize, tsize);
            return canvas;
        },

        buildTiles: function(image, map) {
            var tiles = {};
            for(var i in map){
                var position = map[i];
                var canvas = this.createCanvas(image, position[0], position[1]);
                tiles[i] = ac.tiles.createTile(i, canvas);
            }
            return tiles;
        },

        getTile: function(id) {
            return this.tiles[id];
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
