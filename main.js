(function() {
	"use strict";

    var $loader = ac.import("loader"),
        $widget = ac.import("widget"),
        $board = ac.import("board"),
        $menu = ac.import("menu"),
        $palette = ac.import("palette"),
        $tileset = ac.import("tileset");

    var assets_map = [
        {id: "default_tileset", src: "tilesets/ground-layer.png", type: "image"}
    ];

    var init = function(tilesize) {
        var tileset = $tileset.createTileset("default_tileset", tilesize);
        $palette.createPalette('#palette-panel', tileset);
        $board.createBoard("#board-panel");
        $menu.createMenu("#main-menu");
    };

    $loader.load(assets_map, function(){
        init(64);
    });




})();
