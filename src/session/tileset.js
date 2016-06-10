
ac.export("tileset", function(env){
    "use strict";

    var $graphics = ac.import("graphics");

    var _buildTiles = function(img_path, ts){
        var tiles,
            tile_id = 0;

        ac.log(tiles);
        $graphics.loadImage(img_path, function(image, width, height){
            var _tiles = [],
                cols = Math.floor(width / ts),
                rows = Math.floor(height / ts);

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var tile_img = $graphics.createCanvas(ts, ts);
                    tile_img.draw(image, j*ts, i*ts, 0, 0);
                    _tiles.push({
                        id: tile_id++,
                        image: tile_img
                    });
                }
            }
        });
        return tiles;
    };

    var createTileset = function(img_path, tilesize){
        var tiles = _buildTiles(img_path, tilesize);
        env.set("TILESIZE", tilesize);
        return tiles;
    };

    return {
        createTileset: createTileset
    };
});
