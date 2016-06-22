
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset"),
        $widget  = ac.import("widget");

    var tiles = {},
        element;

    var createTileButtons = function(palette_selector, tileset){
        var buttons = [];
        var click_action = function(e, target){
            console.log(target.attr("id"));
        };

        for(var i=0, len=tileset.length; i<len; i++){
            var tile = tileset[i];
            var tile_id = "tile" + tile.id;
            var tile_widget = $widget.createTileButton({
                content: tile.image.elem,
                width: tile.image.width,
                height: tile.image.height,
                id: tile_id
            }, click_action);
            buttons.push(tile_widget);
            tiles[tile_id] = tile_widget;
        }
        element = $widget.createContainer(palette_selector, buttons);
    };

    var createPalette = function(palette_selector, tileset) {
        createTileButtons(palette_selector, tileset);
        env.set("CURRENT_TILE", "foo");
    };

    return {
        createPalette: createPalette
    };
});
