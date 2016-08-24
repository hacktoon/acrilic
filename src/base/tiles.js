ac.export("tiles", function(env){
    "use strict";

    var Tile = ac.Class({
        init: function(id, canvas){
            this.id = id;
            this.canvas = canvas;
        }
    });

    var createTile = function(id, canvas){
        return new Tile(id, canvas);
    };

    return {
        createTile: createTile
    };
});
