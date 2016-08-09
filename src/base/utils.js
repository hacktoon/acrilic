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

    var filter = function(collection, func){
        var filtered = [];
        for(var i=0; i<collection.length; i++){
            filtered.push(func(collection[i]));
        }
        return filtered;
    };

    var map = function(collection, func){
        for(var i=0; i<collection.length; i++){
            func(collection[i], i);
        }
    };

    return {
        build2DArray: build2DArray,
        filter: filter,
        map: map
    };
});
