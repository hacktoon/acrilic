ac.export("files", function(env){
    "use strict";

    var File = ac.Class({
        init: function(id, tileset, map){
            this.id = id;
            this.tileset = tileset;
            this.map = map;
        }
    });

    var createFile = function(id, tileset, map){
        return new File(id, tileset, map);
    };

    return {
        createFile: createFile
    };
 });
