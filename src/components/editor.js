
ac.export("editor", function(){
	"use strict";

	var _Interface, _Map;

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
				t = AC.TILESIZE,
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
		},

		initInterface: function() {
			var self = this;

			_Interface.createDialogHandler({
				title: 'New map',
				btnSelector: '#btn-file-new',
				templateSelector: '#tpl-dialog-file-new',
				buttonSet: [
					{
						title: 'OK',
						action: function(dialog){
							var name = $('#field-file-new-name').val(),
								width = Number($('#field-file-new-width').val()),
								height = Number($('#field-file-new-height').val());
							if (_currentMap){
								return;
							}
							dialog.close();
							self.openMap(name, _Map.create(width, height));
						}
					},
					{
						title: 'Cancel',
						action: function(dialog){
							dialog.close();
						}
					}
				]
			});

			_Interface.createDialogHandler({
				title: 'Import',
				btnSelector: '#btn-file-import',
				templateSelector: '#tpl-dialog-file-import',
				buttonSet: [
					{
						title: 'Import',
						action: function(dialog){
							$('#field-file-import-map').val();
						}
					},
					{
						title: 'Cancel',
						action: function(dialog){
							dialog.close();
						}
					}
				]
			});

			_Interface.createDialogHandler({
				title: 'Export',
				btnSelector: '#btn-file-export',
				templateSelector: '#tpl-dialog-file-export',
				buttonSet: [
					{
						title: 'Close',
						action: function(dialog){
							dialog.close();
						}
					}
				],
				initialize: function(){
					var json = JSON.stringify({a: 3});
					$("#field-file-export-map").val(json);
				},
			});

			_Interface.createSwitchModeHandler('.btn-tool', {
				'btn-tool-pen': 'pen',
				'btn-tool-fill': 'fill',
				'btn-tool-eraser': 'eraser'
			}, function(value){
				self.setTool(value);
			});

			_Interface.createSwitchModeHandler('.btn-layer', {
				'btn-layer-bg': 'bg',
				'btn-layer-fg': 'fg',
				'btn-layer-event': 'event'
			}, function(value){
				self.setLayer(value);
			});

			_Interface.createTilesetPalette('#tileset-panel', {
				srcImage: 'tilesets/ground-layer.png',
				action: function(tile) {
					_currentPaletteTile = tile;
				}
			});

			_mapEditorElem = _Interface.createMapEditor('#map-panel', {
				action: function(x, y, options) {
					var opt = options || {},
						dragging = opt.dragging;
					if (_currentMap){
						_currentMap.setTile(_currentPaletteTile, x, y);
					}
				}
			});
		},

		initTools: function() {
			_tools = {
				'pen': function(grid){

				},

				'fill': function(grid) {

				},

				'eraser': function(grid) {

				}
			};
		}
	};

});
