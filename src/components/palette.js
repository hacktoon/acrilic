
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset"),
        $dom     = ac.import("dom");

    var _element,
        _tiles = {},
        _tile_class = "tile";

    var _createTileButtons = function(tileset){
        var ts = env.get("TILESIZE");

        for(var i=0, len=tileset.length; i<len; i++){
            var tile = tileset[i],
                div = $dom.create("div", {class: _tile_class});
            _tiles[tile.id] = tile.image;
            $dom.append(div, tile.image);
            $dom.append(_element, div);
        }

        // $dom.click(div, _tile_class, function(target){
        //     ac.log(target);
        // });
    };

    var createPalette = function(selector, tileset) {
        _element = $dom.get(selector);
        _createTileButtons(tileset);
        env.set("CURRENT_TILE", "foo");
    };

    return {
        createPalette: createPalette
    };
});
