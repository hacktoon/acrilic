
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset"),
        $dom     = ac.import("dom");

    var element,
        tiles = {},
        tile_class = "tile";

    var createTileButtons = function(tileset){
        var ts = env.get("TILESIZE");

        for(var i=0, len=tileset.length; i<len; i++){
            var tile = tileset[i],
                div = $dom.create("div", {"class": tile_class});
            tiles[tile.id] = tile.image;
            $dom.append(div, tile.image.elem);
            $dom.append(element, div);
        }

        // $dom.click(div, _tile_class, function(target){
        //     ac.log(target);
        // });
    };

    var createPalette = function(selector, tileset) {
        element = $dom.get(selector);
        createTileButtons(tileset);
        env.set("CURRENT_TILE", "foo");
    };

    return {
        createPalette: createPalette
    };
});
