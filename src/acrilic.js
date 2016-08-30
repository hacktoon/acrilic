var ac = (function(){
    "use strict";

    var self = {
        LAYERS: 3,
        log: console.log.bind(console),
        error: console.error.bind(console),
        tilesetSpecs: [],
        modules: {},
        keys: {
            ESC: 27
        }
    };

    // global environment
    var env = (function(){
        var registry = {
            DOCUMENT: $(document)
        };

        return {
            set: function(key, value){
                registry[key] = value;
            },
            get: function(key){
                return registry[key];
            }
        };
    })();

    var assets = {
        items: [],
        itemsLoaded: 0,
        readyCallback: undefined
    };

    var loadImage = function(src, callback) {
        var image = new Image();
        image.onload = function(){
            callback(image);
            assetLoaded();
        };
        image.src = src;
    };

    var loadAssets = function(callback) {
        assets.readyCallback = callback;
        for(var i=0; i<assets.items.length; i++){
            var asset = assets.items[i];
            loadImage(asset.src, asset.callback);
        }
    };

    var assetLoaded = function() {
        assets.itemsLoaded++;
        if (assets.itemsLoaded == assets.items.length){
            assets.readyCallback();
        }
    };

    var registerAsset = function(src, callback) {
        assets.items.push({src: src, callback: callback});
    };

    self.registerTilesetSpec = function(tilesetSpec){
        registerAsset(tilesetSpec.src, function(image){
            tilesetSpec.image = image;
            self.tilesetSpecs.push(tilesetSpec);
        });
    };

    self.getTilesetSpecs = function(id){
        return self.tilesetSpecs;
    };

    self.export = function(name, func){
        self.modules[name] = func;  // store the function reference
    };

    self.import = function(){
        for (var i=0; i<arguments.length; i++){
          var name = arguments[i];
          if (! self.modules.hasOwnProperty(name)){
            self.error("Module '" + name + "' doesn't exist.");
            return;
          }
          if(self[name] === undefined){
            // execute the function and receive an object
            self[name] = self.modules[name](env);
          }
        }
    };

    self.Class = function(methods) {
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

    self.init = function(callback) {
        loadAssets(callback);
    };

    return self;
})();
