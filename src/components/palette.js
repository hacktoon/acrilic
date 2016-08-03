
ac.export("palette", function(env){
    "use strict";

    var $canvas = ac.import("canvas"),
        $tileset = ac.import("tileset");

    var doc = $(document),
        _self = {
            container: $('#palette-panel'),
            tileset: undefined,
            overlay: undefined,
            selector: undefined,
            columns: 0,
            rows: 0,
            canvas: undefined
        };

    var getSelection = function() {
        return env.get("CURRENT_SELECTION");
    };

    var getTile = function(id) {
        return _self.tileset.getTileById(id);
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
                var tile = _self.tileset.getTileByPosition(y, x);
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

    var initElements = function(tileset){
        var tsize = env.get("TILESIZE"),
            overlay = $("<div/>").attr("id", "palette-overlay"),
            selector = $("<div/>").attr("id", "palette-selector"),
            width = tileset.columns * tsize,
            height = tileset.rows * tsize;

        _self.overlay = overlay.css({width: width, height: height});
        _self.selector = selector;
        _self.container.append(overlay).append(selector);
    };

    var loadTileset = function(tileset){
        var tsize = env.get("TILESIZE");

        _self.columns = tileset.columns;
        _self.rows = tileset.rows;
        _self.canvas = $canvas.createCanvas(tsize*_self.columns, tsize*_self.rows);

        for(var row = 0; row < _self.rows; row++){
            for(var col = 0; col < _self.columns; col++){
                var tile = tileset.getTileByPosition(row, col);
                _self.canvas.draw(tile.getCanvas(), 0, 0, col*tsize, row*tsize);
            }
        }
        _self.container.append(_self.canvas.elem);
    };

    var getRelativeMousePosition = function(event) {
        //calc screen offset
        var tsize = env.get("TILESIZE")
        var x_offset = _self.container.offset().left,
            y_offset = _self.container.offset().top,
            y_scroll = _self.container.scrollTop() + doc.scrollTop();
        //relative position of mouse
        var rx = event.pageX - x_offset,
            ry = event.pageY - y_offset + y_scroll;
        if (rx < 0) { rx = 0; }
        if (ry < 0) { ry = 0; }
        return { x: Math.floor(rx / tsize), y: Math.floor(ry / tsize)};
    };

    var updateSelector = function(event, x0, y0) {
        var tsize = env.get("TILESIZE"), rx0, rx1, ry0, ry1;
        var pos = getRelativeMousePosition(event);
        rx0 = Math.min(x0, pos.x);
        ry0 = Math.min(y0, pos.y);
        rx1 = Math.max(x0, pos.x);
        ry1 = Math.max(y0, pos.y);

        if (rx1 >= _self.columns) { rx1 = _self.columns - 1; }
        if (ry1 >= _self.rows) { ry1 = _self.rows - 1; }
        _self.selector.css({
            width: (rx1 - rx0 + 1) * tsize,
            height: (ry1 - ry0 + 1) * tsize,
            transform: "translate(" + (rx0 * tsize) + "px, " + (ry0 * tsize) + "px)"
        });
        return {x0: rx0, y0: ry0, x1: rx1, y1: ry1};
    };

    var registerEvents = function() {
        var dragging = false,
            x0 = 0,
            y0 = 0;

        _self.overlay.on("mousedown", function(event){
            var pos = getRelativeMousePosition(event);
            x0 = pos.x;
            y0 = pos.y;
            dragging = true;
        });

        doc.on("mousemove", function(event){
            if (! dragging){ return; }
            updateSelector(event, x0, y0);
        });

        doc.on("mouseup", function(event){
            if (! dragging){ return; }
            dragging = false;
            setSelection(updateSelector(event, x0, y0));
        });
    };

    var createPalette = function(tileset) {
        _self.tileset = tileset;
        initElements(tileset);
        loadTileset(tileset);
        registerEvents();
        setSelection();
    };

    return {
        getTile: getTile,
        getSelection: getSelection,
        createPalette: createPalette
    };
});
