
ac.export("pallette", function(env){
    "use strict";

    var $tileset = ac.import("tileset");

    var createPallette = function(selector, tileset) {

        action = function(tile) {
            _currentPaletteTile = tile;
        }

        var t = env.get("TILESIZE"),
            palette = $(panelSelector),
            currentSelected,
            selectedClass = "menu-tile-selected",
            tileBoard = [];

        palette.on('click', '.menu-tile', function(){
            var target = $(this),
                tileSelected,
                tileCode;

            if(currentSelected)
                currentSelected.removeClass(selectedClass);
            target.addClass(selectedClass);
            currentSelected = target;
            tileCode = Number(target.data("tilecode"));
            opt.action(tileBoard[tileCode].elem.get(0));
        })
        .find('.menu-tile:first')
        .trigger('click');
    };

    return {
        init: init,
        buildPallette: buildPallette
    };
});
