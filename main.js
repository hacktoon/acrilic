(function() {
	"use strict";
	
	AC.init();

	AC.Input.init({'dialog': AC.Dialog});

	AC.Interface.build({
		'graphics': AC.Graphics,
		'dialog': AC.Dialog
	});

	AC.Interface.createDialogHandler({
		title: 'New map',
		btnSelector: '#btn-file-new',
		templateSelector: '#tpl-dialog-file-new',
		buttonSet: [
			{title: 'OK', action: function(){
				var name = AC.Input.validate('#field-file-new-name', {'min': 1, 'max': 120, 'type': 'string'}),
					width = AC.Input.validate('#field-file-new-width', {'min': 1, 'max': 40, 'type': 'number'}),
					height = AC.Input.validate('#field-file-new-height', {'min': 1, 'max': 40, 'type': 'number'}),
					map = AC.Map.create(name, width, height);
				AC.Editor.setMap(map);
				AC.Dialog.close();
			}},
			{title: 'Cancel', action: function(){
				AC.Dialog.close();
			}}
		]
	});

	AC.Interface.createDialogHandler({
		title: 'Import',
		btnSelector: '#btn-file-import',
		templateSelector: '#tpl-dialog-file-import',
		buttonSet: [
			{title: 'Import', action: function(){
				$('#field-file-import-map').val();
			}},
			{title: 'Cancel', action: function(){
				AC.Dialog.close();
			}}
		]
	});

	AC.Interface.createDialogHandler({
		title: 'Export',
		btnSelector: '#btn-file-export',
		templateSelector: '#tpl-dialog-file-export',
		buttonSet: [
			{title: 'Close', action: function(){
				AC.Dialog.close();
			}}
		],
		initialize: function(){
			var json = JSON.stringify({a: 3});
			$("#field-file-export-map").val(json);
		},
	});

	AC.Interface.createSwitchModeHandler('.btn-tool', {
		'btn-tool-pen': 'pen',
		'btn-tool-fill': 'fill',
		'btn-tool-eraser': 'eraser'
	});

	AC.Interface.createSwitchModeHandler('.btn-layer', {
		'btn-layer-bg': 'bg',
		'btn-layer-fg': 'fg',
		'btn-layer-event': 'event'
	});

	AC.Interface.createTilesetPalette('#tileset-panel', {
		srcImage: 'tilesets/ground-layer.png',
	});

	AC.Interface.createMapEditor('#map-panel');

	/*AC.Editor.init({
		'maps': AC.Map
	});*/

})();