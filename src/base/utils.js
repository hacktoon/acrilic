ac.export("utils", function(env){
    "use strict";

    var build2DArray = function(rows, cols, default_value){
        var arr = [];
        for (var row = 0; row < rows; row++) {
            arr.push([]);
            for (var col = 0; col < cols; col++) {
                arr[row].push(default_value);
            }
        }
        return arr;
    };

    return {
        build2DArray: build2DArray
    };
});
