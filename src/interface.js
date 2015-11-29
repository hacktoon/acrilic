
AC.Interface = (function(){
	"use strict";

	var _Dialog, _Graphics;

	return {
		createDialogHandler: function(options){
			var self = this,
				opt = options || {},
				templateString = $(opt.templateSelector).html();

			var dialog = _Dialog.modal(opt.title, $(templateString), opt.buttonSet);
			$(opt.btnSelector).on('click', function(){
				dialog.open();
				if ($.isFunction(opt.initialize)){
					opt.initialize();
				}
			});
		},

		createSwitchModeHandler: function(generalSelector, options, action){
			var toggleClass = 'active',
				optionList = $(generalSelector);
			
			optionList.on('click', function(e){
				optionList.removeClass(toggleClass);
				var target = $(this),
					id = target.attr('id'),
					value = options[id];
				target.addClass(toggleClass);
				action(value);
			});
			optionList.first().trigger('click');
		},

		createTilesetPalette: function(panelSelector, options){
			var self = this,
				t = AC.TILESIZE,
				palette = $(panelSelector),
				currentSelected,
				selectedClass = "menu-tile-selected";

			_Graphics.loadImage(options.srcImage, function(image, width, height){
				var cols = Math.floor(width / t),
					rows = Math.floor(height / t);

				for (var i = 0; i < rows; i++) {
					for (var j = 0; j < cols; j++) {
						var tile = _Graphics.createCanvas(t, t);
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

		createMapEditor: function(mapSelector, action){
			var self = this,
				editor = $(mapSelector),
				t = AC.TILESIZE;

			var cursorData = {x: 0, y: 0, dragging: false};

			//cursor de seleção
			var selectCursor = $("<div/>")
				.addClass("selection-cursor")
				.css({"width": t, "height": t});
			editor.append(selectCursor);

            //update the selection cursor
            editor.on('mousemove', function(e){
				//deslocamento em relacao à tela
				var x_offset = editor.offset().left,
					y_offset = editor.offset().top,
					x_scroll = editor.scrollLeft() + $(document).scrollLeft(),
					y_scroll = editor.scrollTop() + $(document).scrollTop();
				//posição relativa do mouse
				var x = e.clientX - x_offset + x_scroll,
					y = e.clientY - y_offset + y_scroll;

				x = (x < 0) ? 0 : x;
				y = (y < 0) ? 0 : y;
				cursorData.x = parseInt(x / t);
				cursorData.y = parseInt(y / t);

				selectCursor.css("left", cursorData.x * t);
				selectCursor.css("top", cursorData.y * t);
				// Allows painting while dragging
				if(cursorData.dragging){
					self.setTile();
				}
			});
			
			// when clicked, gets the current selected tile and paints
			editor.on('mousedown', function(e){
				e.preventDefault();
				//_toolSelected.action();
				cursorData.dragging = true;
			});
			
			$(document).on('mouseup', function(){
				cursorData.dragging = false;
			});
		},

		build: function(modules){
			var self = this;
			_Graphics = modules.graphics;
			_Dialog = modules.dialog;

			// Tweak map panel position
			$('#map-panel').css('left', $('#tileset-panel-wrapper').width());

			return this;
		}
    };

})();
