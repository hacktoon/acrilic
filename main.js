(function() {
	"use strict";
	
	$("#bt_create_map").click(function(){
		var tile_cols = $("#input_tile_cols").val(),
			tile_rows = $("#input_tile_rows").val(),
			tilesize = $("#input_tilesize").val();
		
		AC.init(tile_cols, tile_rows, tilesize);
		AC.tileset.init("#tileset_panel");
		AC.tileset.loadTileset('tilesets/ground-layer.png');
		AC.editor.init("#map_panel");
	});
	
	$("#bt_output").on('click', function(){
		AC.build();
	});

})();
