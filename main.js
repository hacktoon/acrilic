(function() {
	"use strict";

    var $loader = ac.import("loader"),
        $board = ac.import("board"),
        $menu = ac.import("menu"),
        $palette = ac.import("palette"),
        $tileset = ac.import("tileset");

    var assets_map = [
        {id: "default", src: "tilesets/default/bg.png", type: "image"}
    ];

    var init = function(tilesize) {
        var tileset = $tileset.createTileset("default", tilesize);
        $palette.createPalette(tileset);
        $menu.createMenu();
    };

    $loader.load(assets_map, function(){
        init(64);
    });




})();
