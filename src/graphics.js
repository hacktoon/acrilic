// graphics functions

AC.Graphics = (function(){

	var canvasObject = {
		draw: function(image, x, y){
			//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
			var w = this.width,
				h = this.height;
			this.ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
		}
	};
	
	return {
		loadImage: function(src, callback){
			//load the tileset image
			var image = new Image();
			image.onload = function(){
				callback(image, image.width, image.height);
			};
			image.src = src;
		},
		
		createCanvas: function(width, height){
			var canvas = $.extend(true, {}, canvasObject),
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
})();
