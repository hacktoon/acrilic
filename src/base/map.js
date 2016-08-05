
ac.export("map", function(env){
    "use strict";

    var Map = function(name, width, height, grid){
        (function(){
            this.grid = grid || [];
            this.name = name;
            this.width = width;
            this.height = height;

            if (! grid){
                for (var row = 0; row < height; row++) {
                    this.grid.push([]);
                    for (var col = 0; col < width; col++) {
                        this.grid[row][col] = {};
                    }
                }
            }
        }.bind(this))();

        this.outOfRange = function(row, col) {
            var col_limit = col < 0 || col >= this.width;
            var row_limit = row < 0 || row >= this.height;
            return col_limit || row_limit;
        };

        this.set = function(row, col, value){
            if(this.outOfRange(row, col)){ return; }
            this.grid[row][col] = value;
        };

        this.get = function(row, col){
            if(this.outOfRange(row, col)){ return; }
            return this.grid[row][col];
        };

        this.getData = function() {
            return {
                name: this.name,
                width: this.width,
                height: this.height,
                tilesize: env.get("TILESIZE"),
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
