
ac.export("tileset", function(env){
    "use strict";

    var $loader = ac.import("loader"),
        $canvas = ac.import("canvas");

    function Tile(id, canvas){
        (function init(){
            this.id = id;
            this.canvas = canvas;
            this.canvas.elem.addClass('tile');
        }.bind(this))();

        this.getCanvasContext = function() {
            return this.canvas.elem.context;
        }

        this.getElement = function() {
            return this.canvas.elem;
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

    var createTileset = function(asset_id, tilesize){
        var image = $loader.get(asset_id);
        env.set("TILESIZE", tilesize);
        return buildTiles(image, tilesize);
    };

    return {
        createTileset: createTileset
    };
});
