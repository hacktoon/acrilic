ac.export("filesystem", function(env){
    "use strict";

    ac.import("utils");

    var self = {
      LAST_OPEN: 'last-saved'
    };

    var saveFile = function(name, content){
        var json = JSON.stringify(content);
        localStorage.setItem(name, json);
        localStorage.setItem(self.LAST_OPEN, json);
    };

    var getRecentFile = function(){
        return this.loadFile(LAST_OPEN);
    };

    var loadFile = function(name){
        var content = localStorage.getItem(name);
        if (content){
            return JSON.parse(content);
        }
        return;
    };

    return {
        saveFile: saveFile,
        getRecentFile: getRecentFile,
        loadFile: loadFile
    };
});
