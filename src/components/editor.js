
ac.export("editor", function(){
	"use strict";

	var _Interface = ac.import("widget"),
        _Map       = ac.import("map");

	var _mapEditorElem,
		_maps = {},
		_tools = {},
		_layers = {},
		_currentLayer,
		_currentMap,
		_currentTool,
		_currentPaletteTile;

	return {

        createMapEditor: function(mapSelector, options){
            var doc = $(document),
		        opt = options || {},
				x = 0,
				y = 0,
				t = ac.TILESIZE,
				cursorDragging = false,
				mapEditor = $(mapSelector),
				selectCursor = $("<div/>")
					.addClass("selection-cursor")
					.css({"width": t, "height": t});

			mapEditor.append(selectCursor)
			.on('mousemove', function(e){
				//deslocamento em relacao à tela
				var x_offset = mapEditor.offset().left,
					y_offset = mapEditor.offset().top,
					x_scroll = mapEditor.scrollLeft() + doc.scrollLeft(),
					y_scroll = mapEditor.scrollTop() + doc.scrollTop();
				//posição relativa do mouse
				var rx = e.pageX - x_offset + x_scroll,
					ry = e.pageY - y_offset + y_scroll;

				rx = (rx < 0) ? 0 : rx;
				ry = (ry < 0) ? 0 : ry;
				x = parseInt(rx / t);
				y = parseInt(ry / t);

				selectCursor.css("transform", "translate(" + (x * t) + "px, " + (y * t) + "px)");

				// Allows painting while dragging
				if(cursorDragging){
					opt.action(x, y, {dragging: true});
				}
			}).on('mousedown', function(e){
				e.preventDefault();
				cursorDragging = true;
				opt.action(x, y);
			});

			doc.on('mouseup', function(){
				cursorDragging = false;
			});

			// Hack: Fix map panel position
			mapEditor.css('left', $('#tileset-panel-wrapper').width());

			return mapEditor;
		},

		openMap: function(name, map){
			_mapEditorElem.append(map.elem);
			_maps[name] = _currentMap = map;
		},

		setTool: function(id){
			//this.currentTool = _tools[id];
		},

		setLayer: function(id){
			_currentLayer = _layers[id];
		}
	};

});
