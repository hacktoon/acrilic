
ac.export("map", function(){
    "use strict";

    var graphics = ac.import('graphics');

    var _mapObject = {
        grid: [],
        elem: undefined,

        setTile: function(image, x, y){
            //position in the tileset image
            var t = ac.TILESIZE;
            this.grid[y][x] = 1;
            this.canvas.draw(image, 0, 0, x*t, y*t);
        },

        render: function(grid){
            // render grid
        }
    };

    return {
        create: function(cols, rows){
            var t = ac.TILESIZE;
            var map = $.extend(true, {}, _mapObject);

            for (var i = 0; i < rows; i++) {
                map.grid.push([]);
                for (var j = 0; j < cols; j++) {
                    map.grid[i].push({id: 0});
                }
            }
            map.canvas = graphics.createCanvas(cols * t, rows * t);
            map.elem = $('<div/>').addClass('.map');
            map.elem.append(map.canvas.elem);
            return map;
        },

        init: function(modules){
            var self = this;
        }
    };
});
