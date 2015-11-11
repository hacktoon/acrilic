//Acrilic on Canvas Gamified Site Editor

window.log = console.log.bind(console);

var AC = (function(){
	"use strict";
	
	var DEBUG = true,
		_selected_tile,
		_selected_code;

    return {
		tileSize: 0,
		mapWidth: 0,
		mapHeight: 0,
		tileRows: 0,
		tileCols: 0,
		startPoint: [0, 0],
		
		// current selected tile on the menu
		tileCodeSelected: {code: 1, x: 0, y: 0},
		
		//lista de objetos instanciados no mapa
		tileMap: [],
		
		// mapping of tiles at tileset images
		tileCode: [
			[1, 2, 3]
		],
		
		build: function(){
			var json = JSON.stringify(this.tileMap);
			$("#json").val(json);
		},

		init: function(tile_cols, tile_rows, tilesize)
		{
			this.tileCols = tile_cols;
			this.tileRows = tile_rows;
			this.tileSize = tilesize;
			//calculate canvas dimensions
			this.mapWidth = tile_cols * tilesize;
			this.mapHeight = tile_rows * tilesize;
			
			// init the tile object map
			for (var i = 0; i < this.tileRows; i++) {
				this.tileMap.push([]);
				for (var j = 0; j < this.tileCols; j++) {
					this.tileMap[i].push(0);
				}
			}
		}
    };
})();
