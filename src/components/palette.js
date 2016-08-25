
ac.export("palette", function(env){
    "use strict";

    ac.import("utils");

    var _self = {
        doc: $(document),
        container: $('#palette-panel'),
        tileset: undefined,
        overlay: undefined,
        selector: undefined,
        cols: 0,
        rows: 0,
        selection: {}
    };

    var getSelection = function() {
        return _self.selection;
    };

    var getTile = function(id) {
        return _self.tileset.getTileById(id);
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
                var tile = _self.tileset.getTileByPosition(y, x);
                submap[i].push(tile.id);
            }
        }

        _self.selection = {
            submap: submap,
            width: width,
            height: height
        };
    };

    var initElements = function(tileset){
        var tsize = env.get("TILESIZE"),
            overlay = $("<div/>").attr("id", "palette-overlay"),
            selector = $("<div/>").attr("id", "palette-selector")
                .css({width: tsize, height: tsize}),
            width = tileset.cols * tsize,
            height = tileset.rows * tsize;

        _self.overlay = overlay.css({width: width, height: height});
        _self.selector = selector;
        _self.container.append(overlay).append(selector);
    };

    var loadTileset = function(tileset){
        var tsize = env.get("TILESIZE");

        _self.cols = tileset.cols;
        _self.rows = tileset.rows;

        for(var row = 0; row < _self.rows; row++){
            for(var col = 0; col < _self.cols; col++){
                var tile = tileset.getTileByPosition(row, col);
            }
        }
        //_self.container.append(_self.canvas.elem);
    };

    var updateSelector = function(event, x0, y0) {
        var tsize = env.get("TILESIZE"), rx0, rx1, ry0, ry1;
        var pos = ac.utils.getRelativeMousePosition(event, _self.container);
        rx0 = Math.min(x0, pos.x);
        ry0 = Math.min(y0, pos.y);
        rx1 = Math.max(x0, pos.x);
        ry1 = Math.max(y0, pos.y);

        if (rx1 >= _self.cols) { rx1 = _self.cols - 1; }
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
            var pos = ac.utils.getRelativeMousePosition(event, _self.container);
            x0 = pos.x;
            y0 = pos.y;
            dragging = true;
            _self.selection = undefined;
        });

        _self.doc.on("mousemove", function(event){
            if (! dragging){ return; }
            updateSelector(event, x0, y0);
        });

        _self.doc.on("mouseup", function(event){
            if (! dragging){ return; }
            dragging = false;
            setSelection(updateSelector(event, x0, y0));
            _self.doc.trigger("selectionready");
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
