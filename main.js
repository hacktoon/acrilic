(function() {
	"use strict";

    var $loader = ac.import("loader"),
        $board = ac.import("board"),
        $menu = ac.import("menu"),
        $palette = ac.import("palette"),
        $tileset = ac.import("tileset");

    var assets_map = [
        {
            id: "default",
            type: "tileset",
            tilesize: 64,
            src: "tilesets/default.png"
        }
    ];

    var init = function() {
        var default_tileset = $loader.get_asset("tileset", "default");
        var tiles = $tileset.createTileset(default_tileset);
        $palette.createPalette(tiles);
        $menu.createMenu();
    };

    $loader.load_assets(assets_map, init);
})();
