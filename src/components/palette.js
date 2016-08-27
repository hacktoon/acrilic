
ac.export("palette", function(env){
    "use strict";

    ac.import("utils");

    var self = {
        container: $('#palette-panel'),
        overlay: $("#palette-overlay"),
        selector: $("#palette-selector"),
        tileset: undefined,
        rows: 0,
        cols: 0
    };

    var setSelection = function(points) {
        var pts = points || {x0: 0, y0: 0, x1: 0, y1: 0};
        var x0 = pts.x0, y0 = pts.y0, x1 = pts.x1, y1 = pts.y1;
        var tsize = env.get("TILESIZE");
        var image, submap = [];

        var width = (x1 - x0 + 1) * tsize,
            height = (y1 - y0 + 1) * tsize;

        for(var y=y0, i=0; y<=y1; y++, i++){
            submap.push([]);
            for(var x=x0, j=0; x<=x1; x++, j++){
                var tile = self.tileset.getTileByPosition(y, x);
                submap[i].push(tile.id);
            }
        }

        self.selection = {
            submap: submap,
            width: width,
            height: height
        };
    };

    var drawTiles = function(tileset){
        var tsize = tileset.tilesize,
            width = tileset.image.width,
            height = tileset.image.height,
            canvas = ac.utils.createCanvas(width, height);

        for(var id in tileset.tiles){
            var tile = tileset.getTileByID(id),
                pos = tileset.getTilePosition(id),
                x = pos[0] * tsize,
                y = pos[1] * tsize;
            canvas.getContext("2d").drawImage(tile.canvas, x, y);
        }
        self.container.append(canvas);
    };

    var updateSelector = function(event, x0, y0) {
        var tsize = env.get("TILESIZE"), rx0, rx1, ry0, ry1;
        var pos = ac.utils.getRelativeMousePosition(event, self.container);
        rx0 = Math.min(x0, pos.x);
        ry0 = Math.min(y0, pos.y);
        rx1 = Math.max(x0, pos.x);
        ry1 = Math.max(y0, pos.y);

        if (rx1 >= self.cols) { rx1 = self.cols - 1; }
        if (ry1 >= self.rows) { ry1 = self.rows - 1; }
        self.selector.css({
            width: (rx1 - rx0 + 1) * tsize,
            height: (ry1 - ry0 + 1) * tsize,
            transform: "translate(" + (rx0 * tsize) + "px, " + (ry0 * tsize) + "px)"
        });
        return {x0: rx0, y0: ry0, x1: rx1, y1: ry1};
    };

    var registerEvents = function() {
        var doc = env.get("DOCUMENT"),
            dragging = false,
            x0 = 0,
            y0 = 0;

        self.overlay.on("mousedown", function(event){
            var pos = ac.utils.getRelativeMousePosition(event, self.container);
            x0 = pos.x;
            y0 = pos.y;
            dragging = true;
            self.selection = undefined;
        });

        doc
        .on("mousemove", function(event){
            if (! dragging){ return; }
            updateSelector(event, x0, y0);
        })
        .on("mouseup", function(event){
            if (! dragging){ return; }
            dragging = false;
            setSelection(updateSelector(event, x0, y0));
            doc.trigger("selectionready");
        });
    };

    var loadTileset = function(tileset) {
        var tsize = tileset.tilesize,
            width = tileset.image.width,
            height = tileset.image.height;
        self.rows = height / tsize;
        self.cols = width / tsize;
        self.tileset = tileset;
        self.overlay.css({width: width, height: height});
        self.selector.css({width: tsize, height: tsize});
        drawTiles(tileset);
        setSelection();
    };

    var init = function() {
        registerEvents();
    };

    return {
        init: init,
        loadTileset: loadTileset
    };
});
