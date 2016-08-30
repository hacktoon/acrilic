
ac.export("palette", function(env){
    "use strict";

    ac.import("utils");

    var self = {
        container: $('#palette-panel'),
        overlay: $("#palette-overlay"),
        selector: $("#palette-selector"),
        view: $("#palette-view"),
        tileset: undefined
    };

    var selectTiles = function(points) {
        var pts = points || {col0: 0, row0: 0, col1: 0, row1: 0},
            col0 = pts.col0, row0 = pts.row0, col1 = pts.col1, row1 = pts.row1,
            cols = col1 - col0 + 1,
            rows = row1 - row0 + 1,
            submap = ac.utils.build2DArray(rows, cols);

        for(var row=row0; row<=row1; row++){
            for(var col=col0; col<=col1; col++){
                var tile = self.tileset.getTileByPosition(row, col);
                submap[row-row0][col-col0] = tile.id;
            }
        }
        env.set("SELECTED_TILES", {
            submap: submap,
            rows: rows,
            cols: cols
        });
        env.get("DOCUMENT").trigger("tileSelectionEnd");
    };

    var updateSelector = function(points) {
        var tsize = self.tileset.tilesize,
            pts = points || {col0: 0, row0: 0, col1: 0, row1: 0};
        self.selector.css({
            width: (pts.col1 - pts.col0 + 1) * tsize,
            height: (pts.row1 - pts.row0 + 1) * tsize,
            transform: "translate(" + (pts.col0 * tsize) + "px, " + (pts.row0 * tsize) + "px)"
        });
    };

    var getNormalizedPoints = function(row0, col0, row1, col1) {
        // avoid off-limit points and fix inverted coordinates
        var minCol = Math.min(col0, col1),
            minRow = Math.min(row0, row1),
            maxCol = Math.max(col0, col1),
            maxRow = Math.max(row0, row1);

        // avoid selecting cells outside the max width/height
        maxCol = Math.min(maxCol, self.tileset.cols - 1);
        maxRow = Math.min(maxRow, self.tileset.rows - 1);
        return {col0: minCol, row0: minRow, col1: maxCol, row1: maxRow};
    };

    var registerEvents = function() {
        var doc = env.get("DOCUMENT"),
            mousePos = ac.utils.relativePosition,
            dragging = false,
            col0 = 0,
            row0 = 0;

        self.overlay
        .on("mousedown", function(event){
            var tsize, pos;
            if (! self.tileset){ return; }
            tsize = self.tileset.tilesize;
            pos = mousePos(self.container, tsize, event.pageX, event.pageY);
            col0 = pos.col;
            row0 = pos.row;
            dragging = true;
            doc.trigger("tileSelectionStart");
        });

        doc
        .on("mousemove", function(event){
            var pos, points, tsize;
            if (! (self.tileset && dragging)){ return; }
            tsize = self.tileset.tilesize;
            pos = mousePos(self.container, tsize, event.pageX, event.pageY);
            points = getNormalizedPoints(row0, col0, pos.row, pos.col);
            updateSelector(points);
        })
        .on("mouseup", function(event){
            var pos, points, tsize;
            if (! (self.tileset && dragging)){ return; }
            tsize = self.tileset.tilesize;
            dragging = false;
            pos = mousePos(self.container, tsize, event.pageX, event.pageY);
            points = getNormalizedPoints(row0, col0, pos.row, pos.col);
            selectTiles(points);
            updateSelector(points);
        });
    };

    var drawPalette = function(tileset){
        for(var row=0; row < tileset.rows; row++){
            for(var col=0; col < tileset.cols; col++){
                var tile = tileset.getTileByPosition(row, col),
                    x = col * tileset.tilesize,
                    y = row * tileset.tilesize;
                self.canvas.getContext("2d").drawImage(tile.canvas, x, y);
            }
        }
    };

    var loadTileset = function(tileset) {
        var width = tileset.image.width,
            height = tileset.image.height;
        self.tileset = tileset;
        self.selector.css({width: tileset.tilesize, height: tileset.tilesize});
        self.overlay.css({width: width, height: height});
        self.canvas = ac.utils.createCanvas(width, height);
        self.view.html(self.canvas);
        drawPalette(tileset);
        selectTiles();
        updateSelector();
        self.container.show();
    };

    var init = function() {
        registerEvents();
    };

    return {
        init: init,
        loadTileset: loadTileset
    };
});
