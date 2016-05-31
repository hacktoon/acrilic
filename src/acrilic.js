
var ac = (function(){
	"use strict";

    var _modules = {};

    return {
        ESC_KEY: 27,

        log: console.log.bind(console),
        error: console.error.bind(console),

        export: function(name, function_ref){
            _modules[name] = {
                func: function_ref,
                ref: undefined  // ensures execution in runtime only
            };
		},

        import: function(name){
            var mod;
            if (! _modules.hasOwnProperty(name)){
                this.error("Module " + name + " doesn't exist.");
                return;
            }
            mod = _modules[name];
            if(mod.ref === undefined){
                // execute the function and receive an object
                mod.ref = mod.func();
                delete mod.func;
            }
            return mod.ref;
		}
    };
})();
