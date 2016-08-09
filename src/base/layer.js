ac.export("layer", function(env){
    "use strict";

    var $canvas = ac.import("canvas");

    var Layer = function(id, width, height){
        (function(){
            this.id = id;
            this.canvas = $canvas.createCanvas(width, height);
            this.canvas.elem.attr("id", id).addClass('layer');
        }).apply(this);

        this.draw = function(image, x, y){
            this.canvas.draw(image, 0, 0, x, y);
        };

        this.getElement = function(){
            return this.canvas.elem;
        };

        this.select = function(){
            this.canvas.elem.addClass("active");
        };

        this.unselect = function(){
            this.canvas.elem.removeClass("active");
        };
    };

    var createLayer = function(id, rows, cols) {
        var tsize = env.get("TILESIZE");
        return new Layer(id, tsize*cols, tsize*rows);
    }

    return {
        createLayer: createLayer
    };

});
