
ac.export("tileset", function(env){
    "use strict";

    var $loader = ac.import("loader");
    var $graphics = ac.import("graphics");

    var _buildTiles = function(image, ts){
        var tiles = [],
            tile_id = 0,
            cols = Math.floor(image.width / ts),
            rows = Math.floor(image.height / ts);

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var tile_img = $graphics.createCanvas(ts, ts);
                tile_img.draw(image, j*ts, i*ts, 0, 0);
                tiles.push({
                    id: tile_id++,
                    image: tile_img
                });
            }
        }
        return tiles;
    };

    var createTileset = function(img_path, tilesize){
        var image = $loader.get("default_tileset");
        env.set("TILESIZE", tilesize);
        return _buildTiles(image, tilesize);
    };

    return {
        createTileset: createTileset
    };
});
