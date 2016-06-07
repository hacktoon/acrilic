
var ac = (function(){
	"use strict";

    // loaded modules
    var _modules = {};

    // global environment
    var _env = (function(){
        var registry = {};
        return {
            set: function(key, value){
                registry[key] = value;
            },
            get: function(key){
                return registry[key];
            },
            has: function(key){
                return registry.hasOwnProperty(key);
            },
            del: function(key){
                delete registry[key];
            }
        };
    })();

    return {
        ESC_KEY: 27,

        log: console.log.bind(console),
        error: console.error.bind(console),

        clone: function(obj){
            
        },

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
                mod.ref = mod.func(_env);
                delete mod.func;
            }
            return mod.ref;
		}
    };
})();
