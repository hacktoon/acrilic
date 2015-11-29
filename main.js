(function() {
	"use strict";
	
	AC.init();

	AC.Interface.createDialogHandler({
		title: 'New map',
		btnSelector: '#btn-file-new',
		templateSelector: '#tpl-dialog-file-new',
		buttonSet: [
			{title: 'OK', action: function(dialog){
				var name = $('#field-file-new-name').val(),
					width = Number($('#field-file-new-width').val()),
					height = Number($('#field-file-new-height').val()),
					map = AC.Map.create(name, width, height);
				AC.Editor.setMap(map);
				dialog.close();
			}},
			{title: 'Cancel', action: function(dialog){
				dialog.close();
			}}
		]
	});

	AC.Interface.createDialogHandler({
		title: 'Import',
		btnSelector: '#btn-file-import',
		templateSelector: '#tpl-dialog-file-import',
		buttonSet: [
			{title: 'Import', action: function(dialog){
				$('#field-file-import-map').val();
			}},
			{title: 'Cancel', action: function(dialog){
				dialog.close();
			}}
		]
	});

	AC.Interface.createDialogHandler({
		title: 'Export',
		btnSelector: '#btn-file-export',
		templateSelector: '#tpl-dialog-file-export',
		buttonSet: [
			{title: 'Close', action: function(dialog){
				dialog.close();
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
	}, AC.Editor.setTool);

	AC.Interface.createSwitchModeHandler('.btn-layer', {
		'btn-layer-bg': 'bg',
		'btn-layer-fg': 'fg',
		'btn-layer-event': 'event'
	}, AC.Editor.setLayer);

	AC.Interface.createTilesetPalette('#tileset-panel', {
		srcImage: 'tilesets/ground-layer.png',
	});

	AC.Interface.createMapEditor('#map-panel');

})();