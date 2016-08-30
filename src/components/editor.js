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

    var createFile = function(id, rows, cols, tilesetID, map){
        var tileset = ac.tilesets.getTileset(tilesetID);
        var defaultTile = tileset.getDefaultTile();
        var map = ac.maps.createMap(rows, cols, defaultTile.id);
        return new File(id, tilesetID, map);
    };

    var createFileFromJSON = function(json){
        var fileData = JSON.parse(json);
        var map = ac.maps.createMapFrom(fileData.map);
        return new File(fileData.id, fileData.tileset, map);
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
