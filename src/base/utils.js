ac.export("utils", function(env){
    "use strict";

    var build2DArray = function(rows, cols, defaultValue){
        var arr = [];
        for (var row = 0; row < rows; row++) {
            arr.push([]);
            for (var col = 0; col < cols; col++) {
                arr[row].push(defaultValue);
            }
        }
        return arr;
    };

    var relativePosition = function(container, tsize, mouseX, mouseY) {
        var doc = env.get("DOCUMENT"),
            x_offset = container.offset().left,
            y_offset = container.offset().top,
            x_scroll = container.scrollLeft() + doc.scrollLeft(),
            y_scroll = container.scrollTop() + doc.scrollTop(),
            rx = mouseX - x_offset + x_scroll,
            ry = mouseY - y_offset + y_scroll;
        rx = Math.max(rx, 0);
        ry = Math.max(ry, 0);
        return {col: Math.floor(rx / tsize), row: Math.floor(ry / tsize)};
    };

    var filter = function(collection, func){
        var filtered = [];
        for(var i=0; i<collection.length; i++){
            filtered.push(func(collection[i]));
        }
        return filtered;
    };

    var map = function(collection, func){
        var mapped = [];
        for(var i=0; i<collection.length; i++){
            mapped.push(func(collection[i]));
        }
        return mapped;
    };

    var createCanvas = function(width, height){
        return $("<canvas/>").attr({width: width, height: height}).get(0);
    };

    var cropToCanvas = function(image, size, x, y){
        var canvas = createCanvas(size, size);
        canvas.getContext("2d").drawImage(image, x*size, y*size, size, size, 0, 0, size, size);
        return canvas;
    };

    return {
        relativePosition: relativePosition,
        build2DArray: build2DArray,
        createCanvas: createCanvas,
        cropToCanvas: cropToCanvas,
        filter: filter,
        map: map
    };
});
