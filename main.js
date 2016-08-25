(function() {
	"use strict";

    ac.import("boards", "menu", "palette", "tilesets", "filesystem");

    var loadRecentFile = function() {
        var recentFile = ac.filesystem.getRecentFile();
        if(! recentFile){ return; }
        ac.boards.createBoard(recentFile);
    };

    var init = function() {
        var default_tileset_data = ac.getTilesetData("default"),
            tileset = ac.tilesets.createTileset(default_tileset_data);

        ac.palette.createPalette(tileset);
        ac.menu.createMenu();

        loadRecentFile();
    };

    ac.init(init);
})();
