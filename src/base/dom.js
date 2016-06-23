
ac.export("dom", function(env){
    "use strict";

    var get = function(selector){
        return $(selector);
    };

    var append = function(target, child){
        target.append(child);
    };

    var addClass = function(target, classes){
        target.addClass(classes);
    };

    var removeClass = function(target, classes){
        target.removeClass(classes);
    };

    var create = function(tag){
        return $("<"+tag+"/>");
    };

    var on = function(type, target, callback){
        target.on(type, function(e){
            callback(e, target);
        });
    };

    return {
        addClass: addClass,
        removeClass: removeClass,
        append: append,
        on: on,
        create: create,
        get: get
    };
});
