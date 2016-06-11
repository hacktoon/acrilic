
ac.export("loader", function(env){
    "use strict";

    var _items = {},
        _items_loaded = 0,
        _total_items,
        _callback;

    var _update_load_status(){
        _items_loaded++;
        if (_items_loaded == _total_items){
            _callback();
        }
    };

    var _loaders = {
        image: function(id, src){
            var image = new Image();
			image.onload = function(){
				_items[id] = {image, image.width, image.height};
                _update_load_status;
			};
			image.src = src;
        }
    };

    var load = function(items, callback){
        _total_items = items.length;
        _callback = callback;

        for(var i=0; i<_total_items; i++){
            var item = items[i];
            _loaders[item.type](item.id, item.src);
        }
    };

    return {
        load: load
    };
});
