
ac.export("loader", function(env){
    "use strict";

    var items = {},
        items_loaded = 0,
        total_items,
        callback_ref;

    var loader_functions = {
        image: function(id, src){
            var image = new Image();
			image.onload = function(){
				items[id] = image;
                update_load_status();
			};
			image.src = src;
        }
    };

    var update_load_status = function(){
        items_loaded++;
        if (items_loaded == total_items){
            callback_ref();
        }
    };

    var load = function(items, callback){
        total_items = items.length;
        callback_ref = callback;

        for(var i=0; i<total_items; i++){
            var item = items[i];
            loader_functions[item.type](item.id, item.src);
        }
    };

    var get = function(asset_id){
        return items[asset_id];
    };

    return {
        load: load,
        get: get
    };
});
