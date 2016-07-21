
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset");

    var tiles = {},
        elem = $('#palette-panel');

    var selectTile = function(id){
        env.set("CURRENT_TILE", tiles[id]);
        tiles[id].select();
    };

    var createTileButtons = function(tileset){
        var tile_elements = [];
        tileset.forEach(function(tile, _){
            var tile_elem = tile.getElement();
            tile_elem.on('click', function(){
                env.get("CURRENT_TILE").unselect();
                selectTile(tile.id);
            });
            tiles[tile.id] = tile;
            tile_elements.push(tile_elem);
        });
        elem.append(tile_elements);
    };

    var createPalette = function(tileset) {
        createTileButtons(tileset);
        selectTile(0);
    };

    return {
        elem: elem,
        createPalette: createPalette
    };
});
