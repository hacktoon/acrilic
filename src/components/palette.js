
ac.export("palette", function(env){
    "use strict";

    var $tileset = ac.import("tileset"),
        $widget  = ac.import("widget");

    var tile_widgets = {};

    var selectTile = function(id){
        env.set("CURRENT_TILE", tile_widgets[id]);
        tile_widgets[id].select();
    };

    var createTileButtons = function(tileset){
        var widgets = [];
        tileset.forEach(function(tile, _){
            var tile_widget = $widget.createTileWidget(tile, function(){
                env.get("CURRENT_TILE").unselect();
                selectTile(tile.id);
            });
            widgets.push(tile_widget);
            tile_widgets[tile.id] = tile_widget;
        });
        return widgets;
    };

    var createPalette = function(palette_selector, tileset) {
        var widgets = createTileButtons(tileset);
        $widget.createContainer(palette_selector, widgets);
        selectTile(0);
    };

    return {
        createPalette: createPalette
    };
});
