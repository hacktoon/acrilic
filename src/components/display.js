ac.export("display", function(env){
    "use strict";

    ac.import("utils");

    var self = {
        layers: [],
        tileset: undefined,
        map: undefined
    };

    var createLayers = function(width, height) {
        var layers = [];
        for(var i=0; i < ac.data.layers.length; i++){
            var canvas = ac.utils.createCanvas(width, height);
            if(env.get("CURRENT_LAYER") == i){
                $(canvas).addClass("active");
            }
            $(canvas).addClass("layer");
            layers.push(canvas);
        }
        self.layers = layers;
    };

    var registerEvents = function() {
        ac.document
        .on("layerChange", function(){
            var index = env.get("CURRENT_LAYER");
            $(".layer.active").removeClass("active");
            $(self.layers[index]).addClass("active");
        })
        .on("mapChange", function(){
            var cell = env.get("MODIFIED_CELL");
            renderCell(cell.row, cell.col, env.get("CURRENT_LAYER"));
        });
    };

    var renderCell = function(row, col, layerID) {
        var tile = self.map.get(row, col, layerID),
            tsize = self.tileset.tilesize,
            x = tsize * col,
            y = tsize * row,
            context = self.layers[layerID].getContext("2d");
        context.clearRect(x, y, tsize, tsize);
        context.drawImage(tile.canvas, x, y);
    };

    var renderDisplay = function() {
        for(var layerID=0; layerID<self.layers.length; layerID++){
            for(var row=0; row<self.map.rows; row++){
                for(var col=0; col<self.map.cols; col++){
                    renderCell(row, col, layerID);
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
        renderDisplay: renderDisplay
    };
});
