
ac.export("palette", function(env){
    "use strict";

    var tileset = {},
        container = $('#palette-panel');

    var selectTile = function(id){
        env.set("CURRENT_TILE", tileset[id]);
        tileset[id].select();
    };

    var getTile = function(id) {
        return tileset[id];
    };

    var createTileButtons = function(tiles){
        var tile_elements = [];
        tiles.forEach(function(tile, _){
            var tile_elem = tile.getElement();

            tileset[tile.id] = tile;
            tile_elements.push(tile_elem);
        });
        container.append(tile_elements);
    };

    var getRelativeMousePosition = function(event, tilesize) {
        //deslocamento em relacao à tela
        var doc = $(document);
        var x_offset = container.offset().left,
            y_offset = container.offset().top,
            y_scroll = container.scrollTop() + doc.scrollTop();
        //posição relativa do mouse
        var rx = event.pageX - x_offset,
            ry = event.pageY - y_offset + y_scroll;

        rx = (rx < 0) ? 0 : rx;
        ry = (ry < 0) ? 0 : ry;
        return {x: Math.floor(rx / tilesize), y: Math.floor(ry / tilesize)};
    };

    var createPalette = function(tiles) {
        var selector = $("<div/>").attr("id", "palette-selector").appendTo(container);
        var tilesize = env.get("TILESIZE");

        container.on("click", function(event){
            var pos = getRelativeMousePosition(event, tilesize);
            var x = pos.x * tilesize,
                y = pos.y * tilesize;
            selector.css("transform", "translate("+x+"px, "+y+"px)");
        });
        createTileButtons(tiles);
        selectTile(0);
    };

    return {
        getTile: getTile,
        createPalette: createPalette
    };
});
