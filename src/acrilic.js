var ac = (function(){
	"use strict";

    var _self = {
		log: console.log.bind(console),
		error: console.error.bind(console)
	};

	var modules = {};

    // global environment
    var env = (function(){
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

	_self.keys = {
        ESC: 27
	};

	_self.export = function(name, func){
		modules[name] = func;  // store the function reference
	};

	_self.import = function(name){
		if (! modules.hasOwnProperty(name)){
			this.error("Module '" + name + "' doesn't exist.");
			return;
		}
		if(this[name] === undefined){
			// execute the function and receive an object
			this[name] = modules[name](env);
		}
	};

	_self.Class = function(methods) {   
		var _class = function() {    
			this.init.apply(this, arguments);          
		};  

		for (var property in methods) { 
		   _class.prototype[property] = methods[property];
		}

		if (! _class.prototype.init) {
			_class.prototype.init = function(){};
		}

		return _class;    
	};

	return _self;
})();
