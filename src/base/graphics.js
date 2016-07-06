
ac.export("graphics", function(env){
    "use strict";

    var $dom = ac.import("dom");

	function Graphic(width, height){
        (function init(){
            this.width = width;
            this.height = height;
            this.elem = $dom.createElement("canvas", {width: width, height: height});
            this.context = $dom.getCanvasContext(this.elem);
        }.bind(this))();

		this.draw = function(image, sx, sy, dx, dy){
			//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
			var w = this.width,
				h = this.height;
			this.context.drawImage(image, sx, sy, w, h, dx, dy, w, h);
		};

        this.render = function(){
            return this.elem;
        }
	};

	return {
		createGraphic: function(width, height){
			return new Graphic(width, height);
		}
	};
});
