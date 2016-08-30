ac.export("display", function(env){
    "use strict";

    ac.import("utils", "tileset");

    var self = {
        layers: []
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

    var paintBoard = function(cells) {
        if (cells){
            for(var i=0; i<cells.length; i++){
                paintCell(cells[i].row, cells[i].col, env.get("CURRENT_LAYER"));
            }
            return;
        }
        // paint the entire board by default
        for(var layerID=0; layerID<self.layers.length; layerID++){
            for(var row=0; row<self.map.rows; row++){
                for(var col=0; col<self.map.cols; col++){
                    paintCell(row, col, layerID);
                }
            }
        }
    };

});
