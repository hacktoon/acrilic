ac.export("tools", function(env){
    "use strict";

    ac.import("fill");

    var _self = {
        current: undefined,
        tools: {}
    };

    var pen = function(map, row, col) {
        return [{row:row, col:col}];
    };

    var square = function(map, row, col) {
        return [{row:row, col:col}];
    };

    var fill = function(map, row, col) {
        return ac.fill.execute(map, row, col);
    };

    var setTool = function(func) {
        _self.current = func;
    };

    var getCurrentTool = function() {
        return _self.tools[_self.current];
    };

    var initTools = function() {
        _self.tools = {
            pen: pen,
            square: square,
            fill: fill
        };
    };

    return {
        initTools: initTools,
        getCurrentTool: getCurrentTool,
        setTool: setTool
    };
});
