
ac.export("canvas", function(env){
    "use strict";

    var Canvas  = //elimina essa classe  ac.Class({
        init: function(width, height){
            this.width = width;
            this.height = height;
            this.elem = $("<canvas/>").attr({width: width, height: height});
            this.context = this.elem.get(0).getContext('2d');
        },

        draw: function(image, sx, sy, dx, dy){
            //image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
            var w = this.width,
                h = this.height;
            this.context.drawImage(image, sx, sy, w, h, dx, dy, w, h);
        },

        clear: function(x, y, w, h){
            this.context.clearRect(x, y, w, h);
        },

        getElement: function(){
            return this.elem.get(0);
        }
    });

    return {
        createCanvas: function(width, height){
            return new Canvas(width, height);
        }
    };
});
