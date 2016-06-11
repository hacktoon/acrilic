// graphics functions

ac.export("graphics", function(env){
    "use strict";

    var $dom = ac.import("dom");

	var _canvasObject = {
		draw: function(image, sx, sy, dx, dy){
			//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
			var w = this.width,
				h = this.height;
			this.ctx.drawImage(image, sx, sy, w, h, dx, dy, w, h);
		}
	};

	return {
		createCanvas: function(width, height){
			var canvas = ac.clone(_canvasObject),
				elem = $("<canvas/>")
				.attr("width", width)
				.attr("height", height);
			canvas.width = width;
			canvas.height = height;
			canvas.ctx = elem.get(0).getContext("2d");
			canvas.elem = elem;
			return canvas;
		}
	};
});
