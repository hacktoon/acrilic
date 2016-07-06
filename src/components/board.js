
ac.export("board", function(env){
	"use strict";

	var $dom = ac.import("dom"),
        $map = ac.import("map");

    var setLayer = function(id){
        id = 0;
    };

	var createBoard = function(boardSelector){
        var doc = $dom.getElement(document),
	        x = 0,
			y = 0,
			ts = env.get("TILESIZE"),
			cursorDragging = false,
			boardElement = $dom.getElement(boardSelector),
			selectCursor = $dom.createElement("div");
		selectCursor.addClass("selection-cursor");
		selectCursor.style({width: ts, height: ts});

		boardElement.append(selectCursor);
		boardElement.on('mousemove', function(e){
			//deslocamento em relacao à tela
			var x_offset = boardElement.getPosition("left"),
				y_offset = boardElement.getPosition("top"),
				x_scroll = boardElement.getScroll("left") + doc.getScroll("left"),
				y_scroll = boardElement.getScroll("top") + doc.getScroll("top");
			//posição relativa do mouse
			var rx = e.pageX - x_offset + x_scroll,
				ry = e.pageY - y_offset + y_scroll;

			rx = (rx < 0) ? 0 : rx;
			ry = (ry < 0) ? 0 : ry;
			x = Math.floor(rx / ts);
			y = Math.floor(ry / ts);

			selectCursor.style({transform: "translate(" + (x * ts) + "px, " + (y * ts) + "px)"});

			// Allows painting while dragging
			if(cursorDragging){
				//opt.action(x, y, {dragging: true});
			}
		});

        boardElement.on('mousedown', function(e){
			e.preventDefault();
			cursorDragging = true;
			//opt.action(x, y);
		});

		doc.on('mouseup', function(){
			cursorDragging = false;
		});

		return boardElement;
	};

    return {
        createBoard: createBoard,
        setLayer: setLayer
    };
});
