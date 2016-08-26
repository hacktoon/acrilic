ac.export("editor", function(env){
    "use strict";

    ac.import("palette", "board", "tilesets");

    var saveFile = function(file){

    };

    var openFile = function(file){
        var tileset = ac.tilesets.getTileset(file.tileset);
        env.set("TILESIZE", tileset.tilesize);
        env.set("CURRENT_FILE", file);
        //ac.board.loadFile(file);
        ac.palette.loadTileset(tileset);
    };

    return {
        openFile: openFile,
        saveFile: saveFile
    };
});
