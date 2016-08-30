ac.export("editor", function(env){
    "use strict";

    ac.import("palette", "maps", "board", "tilesets");

    var saveFile = function(file){

    };

    var createFile = function(id, rows, cols, tileset){
        var map = ac.maps.createMap(rows, cols);
        return ac.files.createFile(id, tileset, map);
    };

    var openFile = function(file){
        var tileset = ac.tilesets.getTileset(file.tileset);
        ac.board.loadFile(file.map, tileset);
        ac.palette.loadTileset(tileset);
        env.set("CURRENT_FILE", file);
    };

    return {
        createFile: createFile,
        openFile: openFile,
        saveFile: saveFile
    };
});
