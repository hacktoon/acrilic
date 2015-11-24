
AC.Map = (function(){

    var mapObject = {
        grid: []
    };
    
    return {
        create: function(cols, rows){
            var map = $.extend(true, {}, mapObject);
            for (var i = 0; i < rows; i++) {
                map.grid.push([]);
                for (var j = 0; j < cols; j++) {
                    map.grid[i].push({id: 0});
                }
            }
        }
    };
})();
