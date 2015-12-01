
var AC = (function(){
	"use strict";

	window.log = console.log.bind(console);

    return {
		ESC_KEY: 27,
		TILESIZE: 64,

		init: function(){

			this.Map.init({
				'graphics': this.Graphics
			});

			this.Interface.init({
				'graphics': this.Graphics,
				'dialog': this.Dialog
			});

			this.Editor.init({
				'interface': this.Interface,
				'map': this.Map
			});
			
		}
    };
})();
