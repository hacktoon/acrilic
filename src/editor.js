
AC.Editor = (function(){
	"use strict";

	var _maps = [],
		_currentMap,
		_tools = [];
	
	return {
		currentTool: '',
		
		setMap: function(map){
			var self = this;
			_maps.push(map);
			_currentMap = map;
		},

		setTool: function(){},
		setLayer: function(){},
	};

})();
