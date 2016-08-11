ac.export("layers", function(env){
    "use strict";

    ac.import("canvas");

    var _self = {
        layers: [],
        currentIndex: 0
    };

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

    var createLayers = function(rows, cols) {
        var tsize = env.get("TILESIZE");
        var width = tsize*cols,
            height = tsize*rows;
        _self.layers.concat([
            new Layer("bg", width, height),
            new Layer("fg", width, height),
            new Layer("event", width, height)
        ]);
    }

    return {
        createLayers: createLayers
    };

});
