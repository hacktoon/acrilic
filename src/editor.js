
AC.Editor = (function(){
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
								height = Number($('#field-file-new-height').val()),
								map = _Map.create(width, height);
							dialog.close();
							self.openMap(name, map);
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
					_currentMap.setTile(_currentPaletteTile, x, y);
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
		},

		init: function(modules){
			_Map = modules.map;
			_Interface = modules.interface;

			this.initInterface();
			this.initTools();
		}
	};

})();
