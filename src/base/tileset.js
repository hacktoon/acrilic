
ac.export("tileset", function(env){
    "use strict";

    var $loader = ac.import("loader"),
        $canvas = ac.import("canvas");

    function Tile(id, canvas){
        (function init(){
            this.id = id;
            this.canvas = canvas;
        }.bind(this))();

        this.getCanvas = function() {
            return this.canvas.elem.get(0);
        }
    };

    var buildTiles = function(image, tilesize){
        var tiles = [],
            tile_id = 0,
            cols = Math.floor(image.width / tilesize),
            rows = Math.floor(image.height / tilesize);

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var canvas = $canvas.createCanvas(tilesize, tilesize);
                canvas.draw(image, j*tilesize, i*tilesize, 0, 0);
                tiles.push(new Tile(tile_id++, canvas));
            }
        }
        return tiles;
    };

    var createTileset = function(tileset){
        env.set("TILESIZE", tileset.tilesize);
        return buildTiles(tileset.image, tileset.tilesize);
    };

    return {
        createTileset: createTileset
    };
});
