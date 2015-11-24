
AC.Map = (function(){

    var mapObject = {
        name: '',
        grid: [],

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
        }
    };
    
    return {
        create: function(name, cols, rows){
            var map = $.extend(true, {}, mapObject);
            map.name = name;
            for (var i = 0; i < rows; i++) {
                map.grid.push([]);
                for (var j = 0; j < cols; j++) {
                    map.grid[i].push({id: 0});
                }
            }
            return map;
        }
    };
})();
