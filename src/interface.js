
AC.Interface = (function(){
	"use strict";

	var buildDialogButtons = function(dialog, buttonSet){
		var output = '';
		for (var i=0; i<buttonSet.length; i++){
			var btn = buttonSet[i],
				id = 'btn-' + btn.title.replace(/\s+/g, '-').toLowerCase();
			output += '<button id="' + id + '">' + btn.title + '</button>';
			dialog.on('click', '#' + id, btn.action);
		}
		return output;
	};


	return {
		closeDialog: function(){
			$('#dialog-overlay').remove();
		},

		openDialog: function(title, content, buttonSet){
			var self = this;
			var dialog = $($('#tpl-dialog-overlay').html()),
				dialogContent = dialog.find('#dialog-content'),
				dialogButtonSet = dialog.find('#dialog-button-panel');

			dialog.find('.btn-close').on('click', function(){
				self.closeDialog();
			});
			dialog.find('#dialog-titlebar .title').html(title);
			dialogContent.html(content);
			dialogButtonSet.html(buildDialogButtons(dialog, buttonSet));
			dialog.appendTo('body').show();
		},

		createDialogHandler: function(options){
			var self = this,
				opt = options || {},
				templateString = $(opt.templateSelector).html();

			$(opt.btnSelector).on('click', function(){
				self.openDialog(opt.title, $(templateString), opt.buttonSet);
				if (opt.initialize && typeof opt.initialize === 'function'){
					opt.initialize();
				}
			});

			$(document).on('keydown', function(e){
				if (e.which == AC.ESC_KEY){
					self.closeDialog();
				}
			});
		},

		createSwitchModeHandler: function(generalSelector, options){
			var toggleClass = 'active',
				optionList = $(generalSelector);
			
			optionList.on('click', function(e){
				optionList.removeClass(toggleClass);
				var target = $(this),
					id = '#' + target.attr('id'),
					value = options[id];
				target.addClass(toggleClass);
			});
			optionList.first().trigger('click');
		},

		createTilesetPalette: function(panelSelector, options){
			var self = this,
				palette = $(panelSelector);

			this.Graphics.loadImage(options.srcImage, function(image, width, height){
				self.Tileset.buildTileset(image, width, height);
			});
		},

		confirm: function(message, action){
			this.openDialog('', '<p>' + message + '</p>', [
				{title: 'OK', action: function(){
					action();
				}},
				{title: 'Cancel', action: function(){
					self.closeDialog();
				}}
			]);
		},

		build: function(modules){
			var self = this;
			this.Tileset = modules.tileset;
			this.Graphics = modules.graphics;

			this.createDialogHandler({
				title: 'New map',
				btnSelector: '#btn-file-new',
				templateSelector: '#tpl-dialog-file-new',
				buttonSet: [
					{title: 'OK', action: function(){
						alert('OK');
					}},
					{title: 'Cancel', action: function(){
						self.closeDialog();
					}}
				]
			});

			this.createDialogHandler({
				title: 'Import',
				btnSelector: '#btn-file-import',
				templateSelector: '#tpl-dialog-file-import',
				buttonSet: [
					{title: 'Import', action: function(){
						$('#field-file-import-output').val();
					}},
					{title: 'Cancel', action: function(){
						self.closeDialog();
					}}
				]
			});

			this.createDialogHandler({
				title: 'Export',
				btnSelector: '#btn-file-export',
				templateSelector: '#tpl-dialog-file-export',
				buttonSet: [
					{title: 'Close', action: function(){
						self.closeDialog();
					}}
				],
				initialize: function(){
					var json = JSON.stringify({a: 2});
					$("#field-file-export-output").val(json);
				},
			});

			this.createSwitchModeHandler('.btn-tool', {
				'#btn-tool-pen': 'pen',
				'#btn-tool-fill': 'fill',
				'#btn-tool-eraser': 'eraser'
			});

			this.createSwitchModeHandler('.btn-layer', {
				'#btn-layer-bg': 'bg',
				'#btn-layer-fg': 'fg',
				'#btn-layer-event': 'event'
			});

			this.createTilesetPalette('#tileset-panel', {
				srcImage: 'tilesets/ground-layer.png',
			});

			// Tweak map panel position
			$('#map-panel').css('left', $('#tileset-panel-wrapper').width());
		}
    };

})();
