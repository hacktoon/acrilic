
ac.export("palette", function(env){
    "use strict";

    var $canvas = ac.import("canvas");

    var doc = $(document),
        container = $('#palette-panel'),
        tileset_matrix = [],
        tileset_map = {},
        palette_columns = 4,
        palette_rows = 8,
        palette_canvas;

    var getSelection = function() {
        return env.get("CURRENT_SELECTION");
    };

    var getTile = function(id) {
        return tileset_map[id];
    };

    var setSelection = function(points) {
        var pts = points || {x0: 0, y0: 0, x1: 0, y1: 0};
        var x0 = pts.x0, y0 = pts.y0, x1 = pts.x1, y1 = pts.y1;
        var tsize = env.get("TILESIZE");
        var image, matrix = [];

        var width = (x1 - x0 + 1) * tsize,
            height = (y1 - y0 + 1) * tsize;

        image = $canvas.createCanvas(width, height);

        for(var y=y0, i=0; y<=y1; y++, i++){
            matrix.push([]);
            for(var x=x0, j=0; x<=x1; x++, j++){
                var tile = tileset_matrix[y][x];
                matrix[i].push(tile);
                image.draw(tile.getCanvas(), 0, 0, j*tsize, i*tsize);
            }
        }
        env.set("CURRENT_SELECTION", {
            image: image.getElement(),
            matrix: matrix,
            width: width,
            height: height
        });
    };

    var loadTileset = function(tiles){
        var tsize = env.get("TILESIZE");
        var tile_count = 0;
        palette_canvas = $canvas.createCanvas(tsize*palette_columns, tsize*palette_rows);
        for(var i=0; i<palette_rows; i++){
            tileset_matrix.push([]);
            for(var j=0; j<palette_columns; j++){
                if (tile_count < tiles.length){
                    var tile = tiles[tile_count++];
                    tileset_matrix[i].push(tile);
                    tileset_map[tile.id] = tile;
                    palette_canvas.draw(tile.getCanvas(), 0, 0, j*tsize, i*tsize);
                }
            }
        }
        container.append(palette_canvas.elem);
    };

    var getRelativeMousePosition = function(event) {
        //calc screen offset
        var tsize = env.get("TILESIZE")
        var x_offset = container.offset().left,
            y_offset = container.offset().top,
            y_scroll = container.scrollTop() + doc.scrollTop();
        //relative position of mouse
        var rx = event.pageX - x_offset,
            ry = event.pageY - y_offset + y_scroll;
        if (rx < 0) { rx = 0; }
        if (ry < 0) { ry = 0; }
        return { x: Math.floor(rx / tsize), y: Math.floor(ry / tsize)};
    };

    var updateSelector = function(event, selector, x0, y0) {
        var tsize = env.get("TILESIZE"), rx0, rx1, ry0, ry1;
        var pos = getRelativeMousePosition(event);
        rx0 = Math.min(x0, pos.x);
        ry0 = Math.min(y0, pos.y);
        rx1 = Math.max(x0, pos.x);
        ry1 = Math.max(y0, pos.y);
        if (rx1 >= palette_columns) { rx1 = palette_columns - 1; }
        selector.css({
            width: (rx1 - rx0 + 1) * tsize,
            height: (ry1 - ry0 + 1) * tsize,
            transform: "translate(" + (rx0 * tsize) + "px, " + (ry0 * tsize) + "px)"
        });
        return {x0: rx0, y0: ry0, x1: rx1, y1: ry1};
    };

    var createSelector = function() {
        return $("<div/>").attr("id", "palette-selector").appendTo(container);
    };

    var registerEvents = function(selector) {
        var dragging = false;
        var x0 = 0, y0 = 0;
        var overlay = $("<div/>").addClass("palette-overlay").appendTo(container);

        overlay.on("mousedown", function(event){
            var pos = getRelativeMousePosition(event);
            x0 = pos.x;
            y0 = pos.y;
            dragging = true;
        });

        doc.on("mousemove", function(event){
            if (! dragging){ return; }
            updateSelector(event, selector, x0, y0);
        });

        doc.on("mouseup", function(event){
            if (! dragging){ return; }
            dragging = false;
            setSelection(updateSelector(event, selector, x0, y0));
        });
    };

    var createPalette = function(tiles) {
        var selector = createSelector();
        loadTileset(tiles);
        registerEvents(selector);
        setSelection();
    };

    return {
        getTile: getTile,
        getSelection: getSelection,
        createPalette: createPalette
    };
});
