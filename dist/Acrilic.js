
var AC = (function(){
	"use strict";

	window.log = console.log.bind(console);

    return {
		ESC_KEY: 27,
		TILESIZE: 64,

		init: function(){

			this.Map.init({
				'graphics': this.Graphics
			});

			this.Interface.init({
				'graphics': this.Graphics,
				'dialog': this.Dialog
			});

			this.Editor.init({
				'interface': this.Interface,
				'map': this.Map
			});
			
		}
    };
})();
;
AC.Dialog = (function(){
    "use strict";

    var _dialogObject = {
        elem: undefined,
        open: function(){
            this.elem.show();
        },
        close: function(){
            this.elem.hide();
        },
    };

    var _buildDialogButtons = function(dialog, buttonSet){
        var output = '';
        var setButtonAction = function(btn, id){
            dialog.elem.on('click', '#' + id, function(){
                btn.action(dialog);
            });
        };
        for (var i=0; i<buttonSet.length; i++){
            var btn = buttonSet[i],
                id = 'btn-' + btn.title.replace(/\s+/g, '-').toLowerCase();
            output += '<button id="' + id + '">' + btn.title + '</button>';
            setButtonAction(btn, id);
        }
        return output;
    };

    return {
        modal: function(title, content, buttonSet){
            var dialog = $.extend(true, {}, _dialogObject),
                elem = dialog.elem = $($('#tpl-dialog-overlay').html());
            elem.find('.btn-close').on('click', function(){
                dialog.close();
            });
            elem.find('.dialog-titlebar .title').html(title);
            elem.find('.dialog-content').html(content);
            elem.find('.dialog-button-panel').html(_buildDialogButtons(dialog, buttonSet));

            $(document).on('keydown', function(e){
                if (e.which == AC.ESC_KEY){
                    dialog.close();
                }
            });

            $('body').append(elem);

            return dialog;
        },

        confirm: function(message, action){
            var self = this;
            this.open('', '<p>' + message + '</p>', [
                {title: 'OK', action: function(){
                    action();
                    self.close();
                }},
                {title: 'Cancel', action: function(){
                    self.close();
                }}
            ]);
        }
    };

})();
;
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
;// graphics functions

AC.Graphics = (function(){

	var _canvasObject = {
		draw: function(image, sx, sy, dx, dy){
			//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
			var w = this.width,
				h = this.height;
			this.ctx.drawImage(image, sx, sy, w, h, dx, dy, w, h);
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
			var canvas = $.extend(true, {}, _canvasObject),
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
;
AC.Map = (function(){

    var _Graphics;

    var _mapObject = {
        grid: [],
        elem: undefined,

        setTile: function(image, x, y){
            //position in the tileset image
            var t = AC.TILESIZE;
            this.grid[y][x] = 1;
            this.canvas.draw(image, 0, 0, x*t, y*t);
        },

        render: function(grid){
            // render grid 
        }
    };
    
    return {
        create: function(cols, rows){
            var t = AC.TILESIZE;
            var map = $.extend(true, {}, _mapObject);

            for (var i = 0; i < rows; i++) {
                map.grid.push([]);
                for (var j = 0; j < cols; j++) {
                    map.grid[i].push({id: 0});
                }
            }
            map.canvas = _Graphics.createCanvas(cols * t, rows * t);
            map.elem = $('<div/>').addClass('.map');
            map.elem.append(map.canvas.elem);
            return map;
        },

        init: function(modules){
            var self = this;
            _Graphics = modules.graphics;

        }
    };
})();
;(function() {
	"use strict";
	
	AC.init();

	

})();