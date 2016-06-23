
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset"),
        $widget  = ac.import("widget");

    var tile_bts = {},
        element;

    var selectTile = function(id){
        env.set("CURRENT_TILE", tile_bts[id]);
        tile_bts[id].select();
    };

    var createTileButtons = function(palette_selector, tileset){
        var buttons = [];

        tileset.forEach(function(tile, _){
            var tile_bt = $widget.createTileButton(tile, function(){
                console.log("Selected tile with id=" + tile.id);
                env.get("CURRENT_TILE").unselect();
                selectTile(tile.id);
            });
            buttons.push(tile_bt.render());
            tile_bts[tile.id] = tile_bt;
        });
        element = $widget.createContainer(palette_selector, buttons);
    };

    var createPalette = function(palette_selector, tileset) {
        createTileButtons(palette_selector, tileset);
        selectTile(0);
    };

    return {
        createPalette: createPalette
    };
});
