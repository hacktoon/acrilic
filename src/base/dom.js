
ac.export("dom", function(env){
    "use strict";

    var get = function(selector){
        return $(selector);
    };

    var append = function(target, child){
        target.append(child);
    };

    var create = function(tag, options){
        var elem = $("<"+tag+"/>");
        if(options["class"]){
            elem.addClass(options["class"]);
        }
        return elem;
    };

    var action = function(type, target, callback){
        target.on(type, function(e){
            callback(e);
        });
    };

    return {
        append: append,
        action: action,
        create: create,
        get: get
    };
});
