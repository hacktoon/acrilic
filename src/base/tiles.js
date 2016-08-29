ac.export("tiles", function(env){
    "use strict";

    var Tile = ac.Class({
        init: function(id, canvas, walk){
            this.id = id;
            this.canvas = canvas;
            this.walk = walk;
        }
    });

    var createTile = function(id, canvas, walk){
        return new Tile(id, canvas, walk);
    };

    return {
        createTile: createTile
    };
});
