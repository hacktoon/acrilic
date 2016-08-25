(function() {
	"use strict";

    ac.import("boards", "menu", "palette", "tilesets", "filesystem");

    var loadRecentFile = function() {
        var recentFile = ac.filesystem.getRecentFile();
        if(! recentFile){ return; }
        ac.boards.createBoard(recentFile);
    };

    var init = function() {
        ac.tilesets.init(ac.getTilesetSpecs());
        
        ac.menu.createMenu();
        // ac.palette.createPalette(tileset);
        //
        // loadRecentFile();
    };

    ac.init(init);
})();
