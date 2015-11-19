
AC.Interface = (function(){
	"use strict";

	return {

		createDialogHandler: function(options){
			var self = this,
				opt = options || {},
				templateString = $(opt.templateSelector).html();

			$(opt.btnSelector).on('click', function(){
				self.Dialog.open(opt.title, $(templateString), opt.buttonSet);
				if (opt.initialize && typeof opt.initialize === 'function'){
					opt.initialize();
				}
			});

			$(document).on('keydown', function(e){
				if (e.which == AC.ESC_KEY){
					self.Dialog.close();
				}
			});
		},

		createSwitchModeHandler: function(generalSelector, options){
			var toggleClass = 'active',
				optionList = $(generalSelector);
			
			optionList.on('click', function(e){
				optionList.removeClass(toggleClass);
				var target = $(this),
					id = target.attr('id'),
					value = options[id];
				target.addClass(toggleClass);
			});
			optionList.first().trigger('click');
		},

		createTilesetPalette: function(panelSelector, options){
			var self = this,
				t = AC.TILESIZE,
				palette = $(panelSelector),
				currentSelected,
				selectedClass = "menu-tile-selected";

			this.Graphics.loadImage(options.srcImage, function(image, width, height){
				var cols = Math.floor(width / t),
					rows = Math.floor(height / t);

				for (var i = 0; i < rows; i++) {
					for (var j = 0; j < cols; j++) {
						var tile = self.Graphics.createCanvas(t, t);
						tile.draw(image, j*t, i*t);
						tile.elem.addClass("menu-tile").data("tilecode", 0);
						palette.append(tile.elem);
					}
				}

				palette.on('click', '.menu-tile', function(){
					var target = $(this);
					
					if(currentSelected)
						currentSelected.removeClass(selectedClass);
					target.addClass(selectedClass);
					currentSelected = target;
				})
				.find('.menu-tile:first')
				.trigger('click');
			});
		},

		build: function(modules){
			var self = this;
			this.Graphics = modules.graphics;
			this.Dialog = modules.dialog;

			this.createDialogHandler({
				title: 'New map',
				btnSelector: '#btn-file-new',
				templateSelector: '#tpl-dialog-file-new',
				buttonSet: [
					{title: 'OK', action: function(){
						alert('OK');
					}},
					{title: 'Cancel', action: function(){
						self.Dialog.close();
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
						self.Dialog.close();
					}}
				]
			});

			this.createDialogHandler({
				title: 'Export',
				btnSelector: '#btn-file-export',
				templateSelector: '#tpl-dialog-file-export',
				buttonSet: [
					{title: 'Close', action: function(){
						self.Dialog.close();
					}}
				],
				initialize: function(){
					var json = JSON.stringify({a: 2});
					$("#field-file-export-output").val(json);
				},
			});

			this.createSwitchModeHandler('.btn-tool', {
				'btn-tool-pen': 'pen',
				'btn-tool-fill': 'fill',
				'btn-tool-eraser': 'eraser'
			});

			this.createSwitchModeHandler('.btn-layer', {
				'btn-layer-bg': 'bg',
				'btn-layer-fg': 'fg',
				'btn-layer-event': 'event'
			});

			this.createTilesetPalette('#tileset-panel', {
				srcImage: 'tilesets/ground-layer.png',
			});

			// Tweak map panel position
			$('#map-panel').css('left', $('#tileset-panel-wrapper').width());
		}
    };

})();
