
ac.export("loader", function(env){
    "use strict";

    var itemsLoaded = 0,
        totalItems,
        readyCallback,
        assets = {
            tileset: {}
        };

    var loaders = {
        tileset: function(item){
            var image = new Image();
            image.onload = function(){
                item.image = image;
                registerAsset(item);
            };
            image.src = item.src;
        }
    };

    var registerAsset = function(item) {
        assets[item.type][item.id] = item;

        itemsLoaded++;
        if (itemsLoaded == totalItems){
            readyCallback(assets);
        }
    };

    var loadAssets = function(items, callback){
        totalItems = items.length;
        readyCallback = callback;

        for(var i=0; i<totalItems; i++){
            var item = items[i];
            loaders[item.type](item);
        }
    };

    var getAsset = function(type, id){
        return assets[type][id];
    };

    return {
        loadAssets: loadAssets,
        getAsset: getAsset
    };
});
