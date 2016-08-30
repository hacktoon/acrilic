ac.export("tools", function(env){
    "use strict";

    ac.import("fill");

    var self = {};

    self.pen = (function(){
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

    self.square = (function(){
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

    self.fill = {
        mousedown: function(row, col) {
            return ac.fill.execute(row, col);
        },
        mousemove: function() {},
        mouseup: function() {}
    };

    return {
        // drag: drag,
        // mousedown: mousedown,
        // mouseup: mouseup
    };
});
