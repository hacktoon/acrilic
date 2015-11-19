
AC.editor = (function(){
	"use strict";

    var _layers = [],
		_currentLayer = 0,
		_tools = [],
		_toolSelected;
	
	return {
		
		setTile: function(){
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
		
        init: function(elem_id)
        {
			var self = this;
			
			this.addLayer(width, height);
			
            
			
        }
    };

})();
