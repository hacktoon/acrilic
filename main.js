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

    var loadRecentFile = function() {
        var recentFile = ac.fs.getRecentFile(),
            map;
        if(! recentFile){ return; }

        try {
            map = ac.map.importMap(recentFile);
        } catch(err) {
            ac.log("Error loading file '" + recentFile.name + "': " + err);
            return;
        }
        ac.board.createBoard(map);
        map.renderMap();
    }

    var init = function() {
        var default_tileset_data = ac.loader.getAsset("tileset", "default"),
            tileset = ac.tileset.createTileset(default_tileset_data);

        ac.palette.createPalette(tileset);
        ac.menu.createMenu();

        loadRecentFile();
    };

    ac.loader.loadAssets(assetsMap, init);
})();
