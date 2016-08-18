ac.export("tiles", function(env){
    "use strict";

    var Tile = ac.Class({
        init: function(id, canvas){
            this.id = id;
            this.canvas = canvas;
        }
    });

    var create = function(id, canvas){
        return new Tile(id, canvas);
    };

    return {
        create: create
    };
});
