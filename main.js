(function() {
	"use strict";
	
	$("#bt_create_map").click(function(){
		var tile_cols = $("#input_tile_cols").val(),
			tile_rows = $("#input_tile_rows").val(),
			tilesize = $("#input_tilesize").val();
		
		ac.init(tile_cols, tile_rows, tilesize);
		ac.tileset.init("#tileset_panel");
		ac.tileset.loadTileset('tilesets/hacktoon.png');
		ac.editor.init("#map_panel");
	});
	
	$("#bt_output").click(function(){
		ac.build();
	});

})();
