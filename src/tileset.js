// opera a paleta de tiles
AC.tileset = (function(){
	
	var _graphics = AC.graphics,
		TILESIZE = AC.tileSize;
	
	return {
		//element bound to object
		el: undefined,
		$el: undefined,
		// current element selected
		menuTileSelected: undefined,
		
		// the image of the tileset
		sourceImage: undefined,
		
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
		createMenuTile: function(image, tilecode, x, y)
		{
			var self = this;
			var t = AC.tileSize;
			var ctx = _graphics.createCanvas(t, t);
			var menutile = $(ctx.canvas).addClass("menu-tile")
				.data("tilecode", tilecode)
				.click(function(){
					// selects the tile to be used
					self.selectMenuTile($(this), x, y);
				});
			//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
			ctx.drawImage(image, x*t, y*t, t, t, 0, 0, t, t);
			
			this.$el.append(menutile);
		},
		
		// populate the tileset menu according to image/dimensions
		buildTileset: function(image, width, height)
		{
			var t = AC.tileSize;
			var cols = width / t;
			var rows = height / t;
			for (var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					var tilecode = AC.tileCode[i][j];
					this.createMenuTile(image, tilecode, j, i);
				}
			}
			// sets the default tile selected
			this.selectMenuTile(this.$el.children().first(), 0, 0);
		},
		
		// loads the image from the tileset
		loadTileset: function(src)
		{
			var self = this;
			_graphics.loadImage(src, function(image, width, height){
				self.buildTileset(image, width, height);
				self.sourceImage = image;
			});
		},
		
		init: function(elem_id, srcImage)
		{
			this.$el = $(elem_id);
			this.el = this.$el.get(0);
			this.loadTileset(srcImage);
		}
	};
})();
