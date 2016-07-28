
ac.export("tile", function(env){
    "use strict";

    var activeTileClass = 'active',
        tileClass = 'tile';

    function Tile(id, canvas){
        (function init(){
            this.id = id;
            this.canvas = canvas;
            canvas.elem.addClass(tileClass);
        }.bind(this))();

        this.getElement = function() {
            return this.canvas.elem;
        }

        this.getCanvas = function() {
            return this.getElement().get(0);
        }

        this.select = function(){
            this.getElement().addClass(activeTileClass);
        };

        this.unselect = function(){
            this.getElement().removeClass(activeTileClass);
        };
    };

    var createTile = function(id, canvas){
        return new Tile(id, canvas);
    };

    return {
        createTile: createTile
    };
});
