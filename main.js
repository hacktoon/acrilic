(function() {
	"use strict";

    ac.import("assets", "boards", "menu", "palette", "tileset", "filesystem");

    var assetsMap = [
        {
            id: "default",
            type: "tileset",
            tilesize: 64,
            src: "tilesets/default.png"
        }
    ];

    var loadRecentFile = function() {
        var recentFile = ac.filesystem.getRecentFile();
        if(! recentFile){ return; }
        ac.boards.createBoard(recentFile);
    };

    var init = function() {
        var default_tileset_data = ac.assets.getAsset("tileset", "default"),
            tileset = ac.tileset.createTileset(default_tileset_data);

        ac.palette.createPalette(tileset);
        ac.menu.createMenu();

        loadRecentFile();
    };

    ac.assets.loadAssets(assetsMap, init);
})();
