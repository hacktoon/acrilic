
AC.Map = (function(){

    var _Graphics;

    var _mapObject = {
        grid: [],
        canvas: undefined,

        setTile: function(){
            //position in the tileset image
            /*var dx = _cursor.x,
                dy = _cursor.y,
                sx = AC.tileCodeSelected.x,
                sy = AC.tileCodeSelected.y,
                t = AC.tileSize,
                img = AC.tileset.sourceImage;
            if (AC.tileMap[dy][dx] != AC.tileCodeSelected.code){
                AC.tileMap[dy][dx] = AC.tileCodeSelected.code;
                _layers[_currentLayer].drawImage(img, sx*t, sy*t, t, t, dx*t, dy*t, t, t);
            }*/
        },

        render: function(grid){
            // render grid 
        }
    };
    
    return {
        create: function(cols, rows){
            var t = AC.TILESIZE;
            var map = $.extend(true, {}, _mapObject);

            for (var i = 0; i < rows; i++) {
                map.grid.push([]);
                for (var j = 0; j < cols; j++) {
                    map.grid[i].push({id: 0});
                }
            }
            map.canvas = _Graphics.createCanvas(cols * t, rows * t);
            return map;
        },

        init: function(modules){
            var self = this;
            _Graphics = modules.graphics;

        }
    };
})();
