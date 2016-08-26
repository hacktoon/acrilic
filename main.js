(function() {
	"use strict";

    ac.import("menu", "tilesets", "board", "palette");

    var init = function() {
        ac.tilesets.init(ac.getTilesetSpecs());
        ac.board.init();
        ac.palette.init();
        ac.menu.init();
    };

    ac.init(init);
})();
