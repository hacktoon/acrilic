ac.export("fs", function(env){
    "use strict";

    var LAST_OPEN = 'last-saved';

    return {
        saveFile: function(name, content){
            var json = JSON.stringify(content);
            localStorage.setItem(name, json);
            localStorage.setItem(LAST_OPEN, json);
        },

        getRecentFile: function(){
            return this.loadFile(LAST_OPEN);
        },

        loadFile: function(name){
            var content = localStorage.getItem(name);
            if (content){
                return JSON.parse(content);
            }
            return;
        }
    };
});
