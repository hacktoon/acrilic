
ac.export("board", function(env){
	"use strict";

	var $map = ac.import("map");

    var setLayer = function(id){
        id = 0;
    };

	var createBoard = function(boardSelector){
        $("#board-panel")
        var image = env.get("CURRENT_TILE");
        ac.log(x, y, image);
	};

    return {
        createBoard: createBoard,
        setLayer: setLayer
    };
});
