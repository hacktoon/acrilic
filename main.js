(function() {
	"use strict";

	window.log = console.log.bind(console);
	
	AC.init();

	AC.Interface.build({
		'graphics': AC.Graphics,
		'dialog': AC.Dialog
	});

	/*AC.Editor.init({
		'maps': AC.Map
	});*/

})();