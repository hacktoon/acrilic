ac.export("layer", function(env){
    "use strict";

    ac.import("canvas");

    var _self = {
        layers: []
    };

    var Layer = ac.Class({
        init: function(id, width, height){
            this.id = id;
            this.canvas = ac.canvas.createCanvas(width, height);
            this.canvas.elem.attr("id", id).addClass('layer');
        },

        update: function(image, x, y){
            this.canvas.draw(image, 0, 0, x, y);
        },

        getElement: function(){
            return this.canvas.elem;
        },

        activate: function(){
            this.canvas.elem.addClass("active");
        },

        deactivate: function(){
            this.canvas.elem.removeClass("active");
        }
    });

    var activateLayer = function(index) {
        _self.layers[index].activate();
    };

    var deactivateLayer = function(index) {
        _self.layers[index].deactivate();
    };

    var createLayers = function(width, height) {
        _self.layers = [
            new Layer("bg-layer", width, height),
            new Layer("fg-layer", width, height),
            new Layer("evt-layer", width, height)
        ];
        return _self.layers;
    };

    return {
        createLayers: createLayers,
        activateLayer: activateLayer,
        deactivateLayer: deactivateLayer
    };

});
