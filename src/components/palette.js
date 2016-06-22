
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset"),
        $widget  = ac.import("widget");

    var tile_widgets = {},
        element;

    var selectTile = function(id){
        if (tile_widgets[id] === undefined){
            id = 0;
        }
        env.set("CURRENT_TILE", id);
        tile_widgets[id].select();
    };

    var createTileButtons = function(palette_selector, tileset){
        var buttons = [];
        var click_action = function(e, target){
            console.log("Selected tile with id=" + target.data("id"));
            selectTile(target.data("id"));
        };

        for(var i=0, len=tileset.length; i<len; i++){
            var tile = tileset[i];
            var tile_widget = $widget.createTileButton({
                content: tile.image.elem,
                width: tile.image.width,
                height: tile.image.height,
                id: tile.id
            }, click_action);
            buttons.push(tile_widget);
            tile_widgets[tile.id] = tile_widget;
        }
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
