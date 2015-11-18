(function() {
	"use strict";

	window.log = console.log.bind(console);
	
	AC.init();

	AC.Interface.build({
		'tileset': AC.Tileset,
		'graphics': AC.Graphics
	});

})();