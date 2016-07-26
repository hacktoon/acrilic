
ac.export("map", function(env){
    "use strict";

    var Map = function(name, width, height, grid){
        (function(){
            this.grid = grid || [];
            this.name = name;
            this.width = width;
            this.height = height;

            if (! grid){
                for (var y = 0; y < height; y++) {
                    this.grid.push([]);
                    for (var x = 0; x < width; x++) {
                        this.grid[y][x] = {};
                    }
                }
            }
        }.bind(this))();

        this.set = function(x, y, value){
            this.grid[y][x] = value;
        };

        this.get = function(x, y){
            return this.grid[y][x];
        };

        this.getData = function() {
            return {
                name: this.name,
                width: this.width,
                height: this.height,
                grid: this.grid
            };
        };
    };

    var createMap = function(name, w, h){
        return new Map(name, w, h);
    };

    var loadMap = function(obj){
        return new Map(obj.name, obj.width, obj.height, obj.grid);
    };

    return {
        createMap: createMap,
        loadMap: loadMap
    };
});
