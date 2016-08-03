ac.export("tools", function(env){

    var _self = {
        current: undefined,
        map: {}
    };

    var pen = function(map, row, col) {
        return [[row, col]];
    };

    var setTool = function(func) {
        _self.current = func;
    };

    var getTool = function() {
        return _self.map[_self.current];
    };

    var initTools = function() {
        _self.map = {
            pen: pen
        };
    };

    return {
        initTools: initTools,
        getTool: getTool,
        setTool: setTool
    };
});
