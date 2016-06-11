(function() {
	"use strict";

    var $loader = ac.import("loader");
    var $interface = ac.import("interface");

    var assets_map = [
        {id: "default", src: "tilesets/ground-layer.png", type: "image"}
    ];

    $loader.load(assets_map, function(){
        $interface.init();
    });




})();
