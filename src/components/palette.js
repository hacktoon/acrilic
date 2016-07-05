
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset"),
        $widget  = ac.import("widget");

    var tile_bts = {};

    var selectTile = function(id){
        env.set("CURRENT_TILE", tile_bts[id]);
        tile_bts[id].select();
    };

    var createTileButtons = function(tileset){
        var buttons = [];
        tileset.forEach(function(tile, _){
            var tile_bt = $widget.createTileButton(tile, function(){
                env.get("CURRENT_TILE").unselect();
                selectTile(tile.id);
            });
            buttons.push(tile_bt.render());
            tile_bts[tile.id] = tile_bt;
        });
        return buttons;
    };

    var createPalette = function(palette_selector, tileset) {
        var buttons = createTileButtons(tileset);
        $widget.createContainer(palette_selector, buttons);
        selectTile(0);
    };

    return {
        createPalette: createPalette
    };
});
