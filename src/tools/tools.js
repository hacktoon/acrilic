ac.export("tools", function(env){
    "use strict";

    ac.import("fill");

    var _self = {};

    var updateTile = function(row, col) {
        var map = env.get("CURRENT_MAP");
        map.set(row, col);
    };

    _self.pen = (function(){
        return {
            mousedown: function(row, col) {
                updateTile(row, col);
            },
            mousemove: function(row, col) {
                updateTile(row, col);
            },
            mouseup: function() {}
        };
    })();

    _self.square = (function(){
        var row0, col0;
        return {
            mousedown: function(row, col) {
                row0 = row;
                col0 = col;
            },
            mousemove: function(row1, col1) {
                updateTile(row1, col1);
            },
            mouseup: function() {
                row0 = undefined;
                col0 = undefined;
            }
        };
    })();

    _self.fill = {
        mousedown: function(row, col) {
            return ac.fill.execute(row, col);
        },
        mousemove: function() {},
        mouseup: function() {}
    };

    var getTool = function(id) {
        return _self[id];
    };

    return {
        getTool: getTool
    };
});
