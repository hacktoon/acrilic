//Acrilic on Canvas Gamified Site Editor

var AC = (function($){
	"use strict";
	
	var _selected_tile,
		_selected_code;

    return {
		ESC_KEY: 27,
		tileSize: 0,
		
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

		init: function(options){
			var opt = options || {};

			window.log = console.log.bind(console);

			this.tileSize = opt.tileSize;
			
			// init the tile object map
			for (var i = 0; i < this.tileRows; i++) {
				this.tileMap.push([]);
				for (var j = 0; j < this.tileCols; j++) {
					this.tileMap[i].push({id: 0});
				}
			}
		}
    };
})(jQuery);
