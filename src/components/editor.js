ac.export("editor", function(env){
    "use strict";

    ac.import("palette", "board", "tilesets");

    var self = {
        currentFile: undefined
    };

    var saveFile = function(file){

    };

    var openFile = function(file){
        var tileset = ac.tilesets.getTileset(file.tileset);
        self.currentFile = file;
        env.set("TILESIZE", tileset.tilesize);
        //ac.board.loadFile(file);
        ac.palette.loadTileset(tileset);
    };

    var getCurrentFile = function(){
        return self.currentFile;
    };

    return {
        openFile: openFile,
        saveFile: saveFile,
        getCurrentFile: getCurrentFile
    };
});
