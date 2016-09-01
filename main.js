(function() {
	"use strict";

    ac.import("editor", "tilesets", "menu", "board", "palette");

    var init = function(){
        ac.tilesets.init(ac.data.tilesets);
        ac.menu.init();
        ac.palette.init();
    };

    ac.init(init);
})();
