
ac.export("tileset", function(env){
    "use strict";

    var $loader = ac.import("loader"),
        $canvas = ac.import("canvas");

    var activeTileClass = 'active',
        tileClass = 'tile';

    function Tile(id, canvas){
        (function init(){
            this.id = id;
            this.canvas = canvas;
            canvas.elem.addClass(tileClass);
        }.bind(this))();

        this.getElement = function() {
            return this.canvas.elem;
        }

        this.getCanvas = function() {
            return this.getElement().get(0);
        }

        this.select = function(){
            this.getElement().addClass(activeTileClass);
        };

        this.unselect = function(){
            this.getElement().removeClass(activeTileClass);
        };
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
