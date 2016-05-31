
var ac = (function(){
	"use strict";

    var _modules = {};

    return {
        ESC_KEY: 27,

        log: console.log.bind(console),
        error: console.error.bind(console),

        export: function(name, function_ref){
            _modules[name] = {
                func: function_ref,
                ref: undefined  // ensures execution in runtime only
            };
		},

        import: function(name){
            var mod;
            if (! _modules.hasOwnProperty(name)){
                this.error("Module " + name + " doesn't exist.");
                return;
            }
            mod = _modules[name];
            if(mod.ref === undefined){
                // execute the function and receive an object
                mod.ref = mod.func();
                delete mod.func;
            }
            return mod.ref;
		}
    };
})();
 
ac.export("dialog", function(){
    "use strict";

    var dialogObject = {
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
            var dialog = $.extend(true, {}, dialogObject),
                elem = dialog.elem = $($('#tpl-dialog-overlay').html());
            elem.find('.btn-close').on('click', function(){
                dialog.close();
            });
            elem.find('.dialog-titlebar .title').html(title);
            elem.find('.dialog-content').html(content);
            elem.find('.dialog-button-panel').html(_buildDialogButtons(dialog, buttonSet));

            $(document).on('keydown', function(e){
                if (e.which == ac.ESC_KEY){
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
});
 // graphics functions

ac.export("graphics", function(){
    "use strict";

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
});
 
ac.export("widget", function(){
    "use strict";

    var dialog = ac.import("dialog");

    return {
        createDialogHandler: function(options){
            var self = this,
                opt = options || {},
                templateString = $(opt.templateSelector).html();

                var confirm_dialog = dialog.modal(opt.title, $(templateString), opt.buttonSet);
            $(opt.btnSelector).on('click', function(){
                confirm_dialog.open();
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
        }
    };
});
 
ac.export("editor", function(){
	"use strict";

	var _Interface = ac.import("widget"),
        _Map       = ac.import("map");

	var _mapEditorElem,
		_maps = {},
		_tools = {},
		_layers = {},
		_currentLayer,
		_currentMap,
		_currentTool,
		_currentPaletteTile;

	return {

        createMapEditor: function(mapSelector, options){
            var doc = $(document),
		        opt = options || {},
				x = 0,
				y = 0,
				t = ac.TILESIZE,
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
					x_scroll = mapEditor.scrollLeft() + doc.scrollLeft(),
					y_scroll = mapEditor.scrollTop() + doc.scrollTop();
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

			doc.on('mouseup', function(){
				cursorDragging = false;
			});

			// Hack: Fix map panel position
			mapEditor.css('left', $('#tileset-panel-wrapper').width());

			return mapEditor;
		},

		openMap: function(name, map){
			_mapEditorElem.append(map.elem);
			_maps[name] = _currentMap = map;
		},

		setTool: function(id){
			//this.currentTool = _tools[id];
		},

		setLayer: function(id){
			_currentLayer = _layers[id];
		}
	};

});
 ac.export("interface", function(){

    var widget = ac.import("widget"),
        editor = ac.import("editor"),
        dialog = ac.import("dialog"),
        tools = ac.import("tools"),
        map = ac.import("map"),
        pallette = ac.import("pallette");

    var build = function() {
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

		pallette.init('#tileset-panel', {
			srcImage: 'tilesets/ground-layer.png',
			action: function(tile) {
				_currentPaletteTile = tile;
			}
		});

		mapEditorElem = editor.createMapEditor('#map-panel', {
			action: function(x, y, options) {
				var opt = options || {},
					dragging = opt.dragging;
				if (_currentMap){
					_currentMap.setTile(_currentPaletteTile, x, y);
				}
			}
		});
	};

    return {
        build: build
    };
});
 
ac.export("map", function(){
    "use strict";

    var graphics = ac.import('graphics');

    var _mapObject = {
        grid: [],
        elem: undefined,

        setTile: function(image, x, y){
            //position in the tileset image
            var t = ac.TILESIZE;
            this.grid[y][x] = 1;
            this.canvas.draw(image, 0, 0, x*t, y*t);
        },

        render: function(grid){
            // render grid
        }
    };

    return {
        create: function(cols, rows){
            var t = ac.TILESIZE;
            var map = $.extend(true, {}, _mapObject);

            for (var i = 0; i < rows; i++) {
                map.grid.push([]);
                for (var j = 0; j < cols; j++) {
                    map.grid[i].push({id: 0});
                }
            }
            map.canvas = graphics.createCanvas(cols * t, rows * t);
            map.elem = $('<div/>').addClass('.map');
            map.elem.append(map.canvas.elem);
            return map;
        },

        init: function(modules){
            var self = this;
        }
    };
});
 
ac.export("pallette", function(){
    "use strict";

    var graphics = ac.import("graphics");

    return {
        init: function(panelSelector, options){
            var opt = options || {},
                t = ac.TILESIZE,
                palette = $(panelSelector),
                currentSelected,
                selectedClass = "menu-tile-selected",
                tileBoard = [];

            graphics.loadImage(opt.srcImage, function(image, width, height){
                var cols = Math.floor(width / t),
                    rows = Math.floor(height / t),
                    boardIndex = 0;

                for (var i = 0; i < rows; i++) {
                    for (var j = 0; j < cols; j++) {
                        var tile = graphics.createCanvas(t, t);
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
    };
});
 ac.export("tools", function(){

    var _tools;

    return {
        setTool: function(){
            
        },
        initTools: function() {
    		_tools = {
    			pen: function(grid){

    			},

    			fill: function(grid) {

    			},

    			eraser: function(grid) {

    			}
    		};
		}
    };
});
 (function() {
	"use strict";

	var main_interface = ac.import("interface");
    main_interface.build();

})();
