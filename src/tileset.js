// opera a paleta de tiles
AC.Tileset = (function(){
	
	return {
		// current element selected
		menuTileSelected: undefined,
		
		selectMenuTile: function(tile_elem, x, y){
			AC.tileCodeSelected.code = tile_elem.data("tilecode");
			AC.tileCodeSelected.x = x;
			AC.tileCodeSelected.y = y;
			
			// remove o outline do tile selecionado anteriormente
			if(this.menuTileSelected)
				this.menuTileSelected.removeClass("menu-tile-selected");
			tile_elem.addClass("menu-tile-selected");
			this.menuTileSelected = tile_elem;
		},
		
		// creates a canvas with a tile and put on the palette
		createMenuTile: function(image, tilecode, x, y){
			/*var self = this,
				t = AC.TILESIZE,
				ctx = _graphics.createCanvas(t, t);

			var menutile = $(ctx.canvas).addClass("menu-tile")
				.data("tilecode", tilecode)
				.click(function(){
					// selects the tile to be used
					self.selectMenuTile($(this), x, y);
				});
			//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
			ctx.drawImage(image, x*t, y*t, t, t, 0, 0, t, t);
			
			this.elem.append(menutile);*/
		},
		
		// populate the tileset menu according to image/dimensions
		buildTileset: function(image, width, height){
			var t = AC.TILESIZE,
				cols = width / t,
				rows = height / t;

			/*for (var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					var tilecode = 0;
					this.createMenuTile(image, tilecode, j, i);
				}
			}
			// sets the default tile selected
			this.selectMenuTile(this.elem.children().first(), 0, 0);*/
		}
	};
})();
