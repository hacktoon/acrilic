ac.export("tools", function(env){
    "use strict";

    var $fill = ac.import("fill");

    var _self = {
        current: undefined,
        map: {}
    };

    var pen = function(map, row, col, selection) {
        return [{row:row, col:col}];
    };

    var square = function(map, row, col, selection) {
        return [{row:row, col:col}];
    };

    var fill = function(map, row, col, selection) {
        return $fill.execute(map, row, col, selection);
    };

    var setTool = function(func) {
        _self.current = func;
    };

    var getTool = function() {
        return _self.map[_self.current];
    };

    var initTools = function() {
        _self.map = {
            pen: pen,
            square: square,
            fill: fill
        };
    };

    return {
        initTools: initTools,
        getTool: getTool,
        setTool: setTool
    };
});
