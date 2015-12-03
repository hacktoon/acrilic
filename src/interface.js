
AC.Interface = (function(){
	"use strict";

	var _Dialog, _Graphics, _Editor;

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
			var opt = options || {},
				t = AC.TILESIZE,
				palette = $(panelSelector),
				currentSelected,
				selectedClass = "menu-tile-selected",
				tileBoard = [];

			_Graphics.loadImage(opt.srcImage, function(image, width, height){
				var cols = Math.floor(width / t),
					rows = Math.floor(height / t),
					boardIndex = 0;

				for (var i = 0; i < rows; i++) {
					for (var j = 0; j < cols; j++) {
						var tile = _Graphics.createCanvas(t, t);
						tile.draw(image, j*t, i*t, 0, 0);
						tileBoard.push(tile);
						tile.elem.addClass("menu-tile").data("tilecode", boardIndex++);
						palette.append(tile.elem);
					}
				}

				palette.on('click', '.menu-tile', function(){
					var target = $(this),
						tileSelected,
						tileCode;
					
					if(currentSelected)
						currentSelected.removeClass(selectedClass);
					target.addClass(selectedClass);
					currentSelected = target;
					tileCode = Number(target.data("tilecode"));
					opt.action(tileBoard[tileCode].elem.get(0));
				})
				.find('.menu-tile:first')
				.trigger('click');
			});
		},

		createMapEditor: function(mapSelector, options){
			var opt = options || {},
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
					x_scroll = mapEditor.scrollLeft() + $(document).scrollLeft(),
					y_scroll = mapEditor.scrollTop() + $(document).scrollTop();
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
			
			$(document).on('mouseup', function(){
				cursorDragging = false;
			});

			// Hack: Fix map panel position
			mapEditor.css('left', $('#tileset-panel-wrapper').width());

			return mapEditor;
		},

		init: function(modules){
			_Graphics = modules.graphics;
			_Dialog = modules.dialog;
		}
    };

})();
