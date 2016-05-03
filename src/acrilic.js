
var ac = (function(){
	"use strict";

	window.log = console.log.bind(console);

    var _modules = {};

    return {
		ESC_KEY: 27,

        export: function(name, code){
            _modules[name] = {
                code: code,
                ref: undefined  // ensures execution in runtime only
            };
		},

        import: function(name){
            var mod = _modules[name];
            if(mod.ref === undefined){
                mod.ref = mod.code();
                delete mod.code;
            }
            return mod[name].ref;
		}
    };
})();
