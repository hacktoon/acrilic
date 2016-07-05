
ac.export("dom", function(env){
    "use strict";

    var get = function(selector){
        return $(selector);
    };

    var getCanvasContext = function(canvas){
        return canvas.get(0).getContext("2d");
    };

    var append = function(target, child){
        target.append(child);
    };

    var attr = function(target, props){
        target.attr(props);
    };

    var addClass = function(target, classes){
        target.addClass(classes);
    };

    var removeClass = function(target, classes){
        target.removeClass(classes);
    };

    var create = function(tag, props){
        var elem = $("<"+tag+"/>");
        if (props){
            elem.attr(props);
        }
        return elem;
    };

    var on = function(type, target, callback){
        target.on(type, function(e){
            callback(e, target);
        });
    };

    return {
        addClass: addClass,
        removeClass: removeClass,
        getCanvasContext: getCanvasContext,
        attr: attr,
        append: append,
        on: on,
        create: create,
        get: get
    };
});
