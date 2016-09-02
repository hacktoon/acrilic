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

    var copy2DArray = function(array) {
        return array.map(function(arr) {
            return arr.slice();
        });
    };

    var relativePosition = function(container, tsize, mouseX, mouseY) {
        var x_offset = container.offset().left,
            y_offset = container.offset().top,
            x_scroll = container.scrollLeft() + ac.document.scrollLeft(),
            y_scroll = container.scrollTop() + ac.document.scrollTop(),
            rx = mouseX - x_offset + x_scroll,
            ry = mouseY - y_offset + y_scroll;
        rx = Math.max(rx, 0);
        ry = Math.max(ry, 0);
        return {col: Math.floor(rx / tsize), row: Math.floor(ry / tsize)};
    };

    var absCoordinates = function(row0, col0, row1, col1) {
        var minCol = Math.min(col0, col1),
            minRow = Math.min(row0, row1),
            maxCol = Math.max(col0, col1),
            maxRow = Math.max(row0, row1);
        return {row0: minRow, col0: minCol, row1: maxRow, col1: maxCol};
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
        copy2DArray: copy2DArray,
        createCanvas: createCanvas,
        cropToCanvas: cropToCanvas,
        absCoordinates: absCoordinates,
        filter: filter,
        map: map
    };
});
