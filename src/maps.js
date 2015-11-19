
AC.Maps = (function(){

    
    
    return {
        create: function(cols, rows){
            var tileMap = [];
            for (var i = 0; i < rows; i++) {
                tileMap.push([]);
                for (var j = 0; j < cols; j++) {
                    tileMap[i].push({id: 0});
                }
            }

        }
    };
})();
