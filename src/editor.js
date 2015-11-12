
AC.editor = (function(){
	"use strict";

    var _editArea,
		_layers = [],
		_currentLayer = 0,
		_dragging = false,
		_tools = [],
		_toolSelected,
		_cursor = {x: 0, y: 0};
	
	return {
		$el: undefined,
		
		toolPen: {
			action: function(){
				// position in the edit area
				AC.editor.setTile();
			}
		},
		
		setTile: function()
		{
			//position in the tileset image
			var dx = _cursor.x,
				dy = _cursor.y,
				sx = AC.tileCodeSelected.x,
				sy = AC.tileCodeSelected.y,
				t = AC.tileSize,
				img = AC.tileset.sourceImage;
			if (AC.tileMap[dy][dx] != AC.tileCodeSelected.code){
				AC.tileMap[dy][dx] = AC.tileCodeSelected.code;
				_layers[_currentLayer].drawImage(img, sx*t, sy*t, t, t, dx*t, dy*t, t, t);
			}
		},
		
		addLayer: function(width, height)
		{
			//criando canvas
			var layer = AC.gfx.createCanvas(width, height);
			_editArea.append(layer.canvas);
			_layers.push(layer);
		},
		
		setCurrentLayer: function(level){
			if(_layers[level])
				_currentLayer = level;
		},

		buildDialogButtons: function(dialog, buttonSet){
			var output = '';
			for (var i=0; i<buttonSet.length; i++){
				var btn = buttonSet[i],
					id = 'btn-' + btn.title.replace(/\s+/g, '-').toLowerCase();
				output += '<button id="'+id+'">'+btn.title+'</button>';
				dialog.on('click', '#'+id, btn.action);
			}
			return output;
		},

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
			dialogButtonSet.html(this.buildDialogButtons(dialog, buttonSet));
			dialog.appendTo('body').show();
		},

		initMenu: function(){
			var self = this;
			$('#btn-file-new').on('click', function(){
				var content = $($('#tpl-dialog-file-new').html());
				var buttonSet = [
					{title: 'OK', action: function(){
						alert('OK');
					}},
					{title: 'Cancel', action: function(){
						self.closeDialog();
					}}
				];
				self.openDialog('New map', content, buttonSet);
			});
		},
		
        init: function(elem_id)
        {
			var self = this;
			var width = AC.mapWidth;
			var height = AC.mapHeight;
			this.$el = $(elem_id);
			var tilesize = AC.tileSize;
			
			_editArea = $("<div/>")
				.attr("id", "edit_area")
				.css("width", width)
				.css("height", height);
			this.$el.append(_editArea);
			// add a initial layer 
			this.addLayer(width, height);
			
            //cursor de seleção
			var select = $("<div/>")
				.attr("id", "selection_cursor")
				.css("width", tilesize)
				.css("height", tilesize);
			_editArea.append(select);

            //atualizando a posicao do cursor de seleção
            _editArea.on('mousemove', function(e){
				//deslocamento em relacao à tela
				var x_offset = _editArea.offset().left,
					y_offset = _editArea.offset().top,
					x_scroll = _editArea.scrollLeft() + $(document).scrollLeft(),
					y_scroll = _editArea.scrollTop() + $(document).scrollTop();
				//posição relativa do mouse
				var x = e.clientX - x_offset + x_scroll,
					y = e.clientY - y_offset + y_scroll;

				x = (x < 0) ? 0 : x;
				y = (y < 0) ? 0 : y;
				_cursor.x = parseInt(x / tilesize);
				_cursor.y = parseInt(y / tilesize);

				select.css("left", _cursor.x * tilesize);
				select.css("top", _cursor.y * tilesize);
				// Allows painting while dragging
				if(_dragging){
					self.setTile();
				}
			});
			
			// when clicked, gets the current selected tile and paints
			_editArea.on('mousedown', function(e){
				e.preventDefault();
				_toolSelected.action();
				_dragging = true;
			});
			
			$(document).on('mouseup', function(){
				_dragging = false;
			});
			
			_toolSelected = self.toolPen;

			this.initMenu();
        }
    };

})();
