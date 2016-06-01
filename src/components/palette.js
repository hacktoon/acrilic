
ac.export("pallette", function(env){
    "use strict";

    var graphics = ac.import("graphics");

    return {
        init: function(panelSelector, options){
            var opt = options || {},
                t = env.get("TILESIZE"),
                palette = $(panelSelector),
                currentSelected,
                selectedClass = "menu-tile-selected",
                tileBoard = [];

            graphics.loadImage(opt.srcImage, function(image, width, height){
                var cols = Math.floor(width / t),
                    rows = Math.floor(height / t),
                    boardIndex = 0;

                for (var i = 0; i < rows; i++) {
                    for (var j = 0; j < cols; j++) {
                        var tile = graphics.createCanvas(t, t);
                        tile.draw(image, j*t, i*t, 0, 0);
                        tileBoard.push(tile);
                        tile.elem.addClass("menu-tile").data("tilecode", boardIndex++);
                        palette.append(tile.elem);
                    }
                }

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
            });
        },
    };
});
