
ac.export("tileset", function(env){
    "use strict";

    var $loader = ac.import("loader");
    var $graphics = ac.import("graphics");

    function Tile(id, graphic){
        (function init(){
            this.id = id;
            this.graphic = graphic;
        }.bind(this))();

        this.getGraphic = function() {
            return this.graphic.surface;
        }

        this.render = function() {
            return this.graphic.render();
        }
    };

    var buildTiles = function(image, tilesize){
        var tiles = [],
            tile_id = 0,
            cols = Math.floor(image.width / tilesize),
            rows = Math.floor(image.height / tilesize);

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var graphic = $graphics.createGraphic(tilesize, tilesize);
                graphic.draw(image, j*tilesize, i*tilesize, 0, 0);
                tiles.push(new Tile(tile_id++, graphic, tilesize));
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
