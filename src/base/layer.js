ac.export("layer", function(env){
    "use strict";

    ac.import("canvas");

    var Layer = ac.Class({
        init: function(id, width, height){
            this.id = id;
            this.canvas = ac.canvas.createCanvas(width, height);
            this.canvas.elem.attr("id", id).addClass('layer');
        },

        draw: function(image, x, y){
            this.canvas.draw(image, 0, 0, x, y);
        },

        getElement: function(){
            return this.canvas.elem;
        },

        select: function(){
            this.canvas.elem.addClass("active");
        },

        unselect: function(){
            this.canvas.elem.removeClass("active");
        }
    });

    var createLayer = function(id, rows, cols) {
        var tsize = env.get("TILESIZE");
        return new Layer(id, tsize*cols, tsize*rows);
    }

    return {
        createLayer: createLayer
    };

});
