ac.export("interface", function(){

    var widget = ac.import("widget"),
        editor = ac.import("editor"),
        dialog = ac.import("dialog"),
        tools = ac.import("tools"),
        map = ac.import("map"),
        pallette = ac.import("pallette");

    var _mapEditorElem;

    var buildPallette = function() {
		var self = this;
        pallette.init('#tileset-panel', {
			srcImage: 'tilesets/ground-layer.png',
			action: function(tile) {
				_currentPaletteTile = tile;
			}
		});
    };

    var buildEditor = function(){
        _mapEditorElem = editor.createMapEditor('#map-panel', {
            action: function(x, y, options) {
                var opt = options || {},
                    dragging = opt.dragging;
                if (_currentMap){
                    _currentMap.setTile(_currentPaletteTile, x, y);
                }
            }
        });
    };

    var buildMenu = function() {
		var self = this;

		widget.createDialogHandler({
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
						self.openMap(name, map.create(width, height));
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

		widget.createDialogHandler({
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

		widget.createDialogHandler({
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

		widget.createSwitchModeHandler('.btn-tool', {
			'btn-tool-pen': 'pen',
			'btn-tool-fill': 'fill',
			'btn-tool-eraser': 'eraser'
		}, function(value){
			tools.setTool(value);
		});

		widget.createSwitchModeHandler('.btn-layer', {
			'btn-layer-bg': 'bg',
			'btn-layer-fg': 'fg',
			'btn-layer-event': 'event'
		}, function(value){
			editor.setLayer(value);
		});
	};

    var init = function init() {
        buildMenu();
        buildPallette();
        buildEditor();
    };

    return {
        init: init
    };
});
