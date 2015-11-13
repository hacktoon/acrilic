// graphics functions

AC.graphics = (function(){
	
	return {
		ctx: undefined,
		
		loadImage: function(src, callback){
			//load the tileset image
			var image = new Image();  // Create new img element
			image.onload = function(){
				callback(image, image.width, image.height);
			};
			image.src = src;
		},
		
		createCanvas: function(width, height)
		{
			var canvas = $("<canvas/>");
			canvas.attr("width", width).attr("height", height);
			return canvas.get(0).getContext("2d");
		}
	};
})();
