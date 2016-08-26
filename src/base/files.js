ac.export("files", function(env){
    "use strict";

    var File = ac.Class({
        init: function(id, tileset, map){
            this.id = id;
            this.tileset = tileset;
            this.map = map;
        },

        toJSON: function(){
            return JSON.stringify({
                id: this.id,
                tileset: this.tileset,
                map: this.map.toJSON()
            });
        }
    });

    var createFile = function(id, tileset, map){
        return new File(id, tileset, map);
    };

    var createFileFromJSON = function(json){
        var fileData = JSON.parse(json);
        return createFile(fileData.id, fileData.tileset, fileData.map);
    };

    return {
        createFile: createFile,
        createFileFromJSON: createFileFromJSON
    };
 });
