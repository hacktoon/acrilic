ac.export("display", function(env){
    "use strict";

    ac.import("utils");

    var self = {
        layers: [],
        tileset: undefined,
        map: undefined
    };

    var paintCell = function(row, col, layerID) {
        var id = self.map.get(row, col),
            tile = self.tileset.getTileByID(id),
            tsize = self.tileset.tilesize,
            x = tsize * col,
            y = tsize * row,
            context = self.layers[layerID].getContext("2d");
        context.clearRect(x, y, tsize, tsize);
        context.drawImage(tile.canvas, x, y);
    };

    var showCurrentLayer = function() {
        var index = env.get("CURRENT_LAYER");
        $(".layer.active").removeClass("active");
        $(self.layers[index]).addClass("active");
    };

    var createLayers = function(width, height) {
        var layers = [];
        for(var i=0; i < ac.data.layers.length; i++){
            var canvas = ac.utils.createCanvas(width, height);
            $(canvas).addClass("layer");
            layers.push(canvas);
        }
        self.layers = layers;
        showCurrentLayer();
    };

    var registerEvents = function() {
        ac.document
        .on("layerChange", function(){ showCurrentLayer(); })
        .on("mapChange", function(){ updateDisplay(); });
    };

    var updateDisplay = function() {
        var modifiedCells = env.get("MODIFIED_CELLS");
        for(var i=0; i<modifiedCells.length; i++){
            var cell = modifiedCells[i];
            paintCell(cell.row, cell.col, env.get("CURRENT_LAYER"));
        }
    };

    var renderDisplay = function() {
        for(var layerID=0; layerID<self.layers.length; layerID++){
            for(var row=0; row<self.map.rows; row++){
                for(var col=0; col<self.map.cols; col++){
                    paintCell(row, col, layerID);
                }
            }
        }
    };

    var createDisplay = function(width, height, map, tileset) {
        self.map = map;
        self.tileset = tileset;
        createLayers(width, height);
        registerEvents();
        renderDisplay();
        return self.layers;
    };

    return {
        createDisplay: createDisplay,
        renderDisplay: renderDisplay,
        updateDisplay: updateDisplay
    };
});
