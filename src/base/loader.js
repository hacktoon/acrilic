
ac.export("loader", function(env){
    "use strict";

    var items_loaded = 0,
        total_items,
        ready_callback,
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

        items_loaded++;
        if (items_loaded == total_items){
            ready_callback(assets);
        }
    };

    var loadAssets = function(items, callback){
        total_items = items.length;
        ready_callback = callback;

        for(var i=0; i<total_items; i++){
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
