
ac.export("loader", function(env){
    "use strict";

    var items_loaded = 0,
        total_items,
        ready_callback,
        assets = {
            tileset: {}
        };

    var register_asset = function(item) {
        assets[item.type][item.id] = item;

        items_loaded++;
        if (items_loaded == total_items){
            ready_callback(assets);
        }
    };

    var loader_functions = {
        tileset: function(item){
            var image = new Image();
			image.onload = function(){
				item.image = image;
                register_asset(item);
			};
			image.src = item.src;
        }
    };

    var load_assets = function(items, callback){
        total_items = items.length;
        ready_callback = callback;

        for(var i=0; i<total_items; i++){
            var item = items[i];
            loader_functions[item.type](item);
        }
    };

    var get_asset = function(type, id){
        return assets[type][id];
    };

    return {
        load_assets: load_assets,
        get_asset: get_asset
    };
});
