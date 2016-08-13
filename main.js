(function() {
	"use strict";

    ac.import("loader", "board", "menu", "palette", "tileset", "fs");

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
        var recentFile = ac.fs.getRecentFile();

        ac.palette.createPalette(tileset);
        ac.menu.createMenu();

        if (recentFile){
            var map = ac.map.importMap(recentFile);
            ac.board.createBoard(map);
            ac.board.renderMap();
        }

    };

    ac.loader.loadAssets(assetsMap, init);
})();
