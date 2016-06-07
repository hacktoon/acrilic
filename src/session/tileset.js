
ac.export("tileset", function(env){
    "use strict";

    var $graphics = ac.import("graphics");

    var _tilesetModel = {

    };

    var buildTiles = function(img_path, ts){
        graphics.loadImage(img_path, function(image, width, height){
            var cols = Math.floor(width / ts),
                rows = Math.floor(height / ts),
                boardIndex = 0;

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var tile = $graphics.createCanvas(ts, ts);
                    tile.draw(image, j*ts, i*ts, 0, 0);
                    tileBoard.push(tile);
                    tile.elem.addClass("menu-tile").data("tilecode", boardIndex++);
                    palette.append(tile.elem);
                }
            }
        });
    };

    var load = function(img_path, tilesize){
        var tileset = buildTiles(img_path, tilesize);
        env.set("TILESIZE", tilesize);
        env.set("TILESET", tileset);
    };

    return {
        load: load
    };
});
