
ac.export("palette", function(env){
    "use strict";

    var $canvas = ac.import("canvas");

    var doc = $(document),
        tileset = {},
        container = $('#palette-panel'),
        max_width = 4,
        max_height = 8,
        selector;

    var selectTile = function(id){
        env.set("CURRENT_TILE", tileset[id]);
    };

    var getTile = function(id) {
        return tileset[id];
    };

    var fillPalette = function(tiles){
        var tsize = env.get("TILESIZE");
        var tile_canvas = $canvas.createCanvas(tsize*max_width, tsize*max_height);
        var x = 0, y = 0, i = 1;
        tile_canvas.elem.attr("id", "tile-canvas");
        tiles.forEach(function(tile, _){
            tileset[tile.id] = tile;
            tile_canvas.draw(tile.getCanvas(), 0, 0, x, y);
            x += tsize;
            if (i == max_width){
                y += tsize;
                x = 0;
                i = 0;
            }
            i++;
        });
        container.append(tile_canvas.elem);
    };

    var getRelativeMousePosition = function(event, tilesize) {
        //deslocamento em relacao à tela
        var x_offset = container.offset().left,
            y_offset = container.offset().top,
            y_scroll = container.scrollTop() + doc.scrollTop();
        //posição relativa do mouse
        var rx = event.pageX - x_offset,
            ry = event.pageY - y_offset + y_scroll;
        if (rx < 0) { rx = 0; }
        if (ry < 0) { ry = 0; }
        return { x: Math.floor(rx / tilesize), y: Math.floor(ry / tilesize)};
    };

    var updateSelector = function(x, y, w, h) {
        selector.css({
            width: w,
            height: h,
            transform: "translate(" + x + "px, " + y + "px)"
        });
    };

    var registerEvents = function() {
        var tsize = env.get("TILESIZE");
        var dragging = false;
        var x0 = 0, y0 = 0;

        container.on("mousedown", function(event){
            var pos = getRelativeMousePosition(event, tsize);
            x0 = pos.x;
            y0 = pos.y;
            dragging = true;
            updateSelector(x0*tsize, y0*tsize, tsize, tsize);
        });

        doc.on("mousemove", function(event){
            var width, height, pos, rx0, rx1, ry0, ry1;
            if (! dragging){ return; }
            pos = getRelativeMousePosition(event, tsize);
            rx0 = Math.min(x0, pos.x);
            ry0 = Math.min(y0, pos.y);
            rx1 = Math.max(x0, pos.x);
            ry1 = Math.max(y0, pos.y);
            if (rx1 >= max_width) { rx1 = max_width - 1; }
            width = Math.abs(rx1 - rx0) * tsize + tsize;
            height = Math.abs(ry1 - ry0) * tsize + tsize;
            updateSelector(rx0*tsize, ry0*tsize, width, height);
        });

        doc.on("mouseup", function(event){
            var width, height, pos, rx0, rx1, ry0, ry1;
            if (! dragging){ return; }
            pos = getRelativeMousePosition(event, tsize);
            dragging = false;
            rx0 = Math.min(x0, pos.x);
            ry0 = Math.min(y0, pos.y);
            rx1 = Math.max(x0, pos.x);
            ry1 = Math.max(y0, pos.y);
            if (rx1 >= max_width) { rx1 = max_width - 1; }
            width = Math.abs(rx1 - rx0) * tsize + tsize;
            height = Math.abs(ry1 - ry0) * tsize + tsize;
            updateSelector(rx0*tsize, ry0*tsize, width, height);
        });

    };

    var createPalette = function(tiles) {
        selector = $("<div/>").attr("id", "palette-selector").appendTo(container);
        fillPalette(tiles);
        registerEvents();
        selectTile(0);
    };

    return {
        getTile: getTile,
        createPalette: createPalette
    };
});
