(function() {
	"use strict";

    ac.import("loader", "board", "menu", "palette", "tileset");

    var assetsMap = [
        {
            id: "default",
            type: "tileset",
            tilesize: 64,
            src: "tilesets/default.png"
        }
    ];

    var init = function() {
        var default_tileset_data = ac.loader.getAsset("tileset", "default");
        var tileset = ac.tileset.createTileset(default_tileset_data);
        ac.palette.createPalette(tileset);
        ac.menu.createMenu();
    };

    ac.loader.loadAssets(assetsMap, init);
})();
