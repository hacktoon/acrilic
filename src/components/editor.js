ac.export("editor", function(env){
    "use strict";

    ac.import("palette", "maps", "board", "tilesets");

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

    var saveFile = function(file){

    };

    var createFile = function(id, rows, cols, tileset){
        var map = ac.maps.createMap(rows, cols);
        return new File(id, tileset, map);
    };

    var createFileFromJSON = function(json){
        var fileData = JSON.parse(json);
        return createFile(fileData.id, fileData.tileset, fileData.map);
    };

    var openFile = function(file){
        var tileset = ac.tilesets.getTileset(file.tileset);
        ac.board.loadFile(file.map, tileset);
        ac.palette.loadTileset(tileset);
        env.set("CURRENT_FILE", file);
    };

    return {
        createFile: createFile,
        createFileFromJSON: createFileFromJSON,
        openFile: openFile,
        saveFile: saveFile
    };
});
