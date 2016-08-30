(function() {
	"use strict";

    ac.import("editor", "tilesets", "menu", "board", "palette");

    var init = function(){
        ac.tilesets.init(ac.getTilesetSpecs());
        ac.menu.init();
        ac.board.init();
        ac.palette.init();
    };

    ac.init(init);
})();
