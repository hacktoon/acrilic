//Acrilic on Canvas Map Editor

var AC = (function(){
	"use strict";

	window.log = console.log.bind(console);

    return {
		ESC_KEY: 27,
		TILESIZE: 64,

		init: function(){
			
			
			// init the tile object map
			/*for (var i = 0; i < this.tileRows; i++) {
				this.tileMap.push([]);
				for (var j = 0; j < this.tileCols; j++) {
					this.tileMap[i].push({id: 0});
				}
			}*/
		}
    };
})();
;
AC.Dialog = (function(){
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
        close: function(){
            $('#dialog-overlay').remove();
        },

        open: function(title, content, buttonSet){
            var self = this,
                dialog = $($('#tpl-dialog-overlay').html()),
                dialogContent = dialog.find('#dialog-content'),
                dialogButtonSet = dialog.find('#dialog-button-panel');

            dialog.find('.btn-close').on('click', function(){
                self.close();
            });
            dialog.find('#dialog-titlebar .title').html(title);
            dialogContent.html(content);
            dialogButtonSet.html(buildDialogButtons(dialog, buttonSet));
            dialog.appendTo('body').show();
        },

        confirm: function(message, action){
            this.open('', '<p>' + message + '</p>', [
                {title: 'OK', action: function(){
                    action();
                }},
                {title: 'Cancel', action: function(){
                    self.closeDialog();
                }}
            ]);
        }
    };

})();
;
AC.Editor = (function(){
	"use strict";

	var _maps = [],
		_currentMap,
		_tools = [];
	
	return {
		currentTool: '',
		
		setMap: function(map){
			var self = this;
			_maps.push(map);
			_currentMap = map;
		}
	};

})();
;// graphics functions

AC.Graphics = (function(){

	var canvasObject = {
		draw: function(image, x, y){
			//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
			var w = this.width,
				h = this.height;
			this.ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
		}
	};
	
	return {
		loadImage: function(src, callback){
			//load the tileset image
			var image = new Image();
			image.onload = function(){
				callback(image, image.width, image.height);
			};
			image.src = src;
		},
		
		createCanvas: function(width, height){
			var canvas = $.extend(true, {}, canvasObject),
				elem = $("<canvas/>")
				.attr("width", width)
				.attr("height", height);
			canvas.width = width;
			canvas.height = height;
			canvas.ctx = elem.get(0).getContext("2d");
			canvas.elem = elem;
			return canvas;
		}
	};
})();
;
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

		createMapEditor: function(mapSelector){
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
			this.Graphics = modules.graphics;
			this.Dialog = modules.dialog;

			// Tweak map panel position
			$('#map-panel').css('left', $('#tileset-panel-wrapper').width());

			return this;
		}
    };

})();
;
AC.Map = (function(){

    var mapObject = {
        name: '',
        grid: [],

        setTile: function(){
            //position in the tileset image
            /*var dx = _cursor.x,
                dy = _cursor.y,
                sx = AC.tileCodeSelected.x,
                sy = AC.tileCodeSelected.y,
                t = AC.tileSize,
                img = AC.tileset.sourceImage;
            if (AC.tileMap[dy][dx] != AC.tileCodeSelected.code){
                AC.tileMap[dy][dx] = AC.tileCodeSelected.code;
                _layers[_currentLayer].drawImage(img, sx*t, sy*t, t, t, dx*t, dy*t, t, t);
            }*/
        }
    };
    
    return {
        create: function(name, cols, rows){
            var map = $.extend(true, {}, mapObject);
            map.name = name;
            for (var i = 0; i < rows; i++) {
                map.grid.push([]);
                for (var j = 0; j < cols; j++) {
                    map.grid[i].push({id: 0});
                }
            }
            return map;
        }
    };
})();
;(function() {
	"use strict";
	
	AC.init();

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
				var name = $('#field-file-new-name').val(),
					width = $('#field-file-width-name').val(),
					height = $('#field-file-height-name').val();
				log('Map created: "' + name + '" with dimensions (' + width + ' x ' + height + ')');
				var map = AC.Map.create(name, width, height);
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
				$('#field-file-import-output').val();
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
			$("#field-file-export-output").val(json);
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