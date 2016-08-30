(function() {
	"use strict";

    ac.import("editor", "tilesets", "menu", "board", "palette");

    var init = function(){
        env.set("DOCUMENT", $(document));
        ac.tilesets.init(ac.data.tilesets);
        ac.menu.init();
        ac.board.init();
        ac.palette.init();
    };

    ac.init(init);
})();
