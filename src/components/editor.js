ac.export("editor", function(env){
    "use strict";

    ac.import("palette", "boards", "files");

    var self = {
        currentFile: undefined
    };

    var saveFile = function(file){

    };

    var openFile = function(file){
        self.currentFile = file;
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
