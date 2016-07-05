
ac.export("dom", function(env){
    "use strict";

    function Element(tagName){
        (function init(){
            if (tagName){
                this.ref = $("<"+tagName+"/>");
            }
        }.bind(this))();

        this.append = function(child){
            this.ref.append(child);
        };

        this.attr = function(props){
            this.ref.attr(props);
        };

        this.addClass = function(classes){
            this.ref.addClass(classes);
        };

        this.removeClass = function(classes){
            this.ref.removeClass(classes);
        };

        this.on = function(type, callback){
            this.ref.on(type, function(e){
                callback(e, this.ref);
            });
        };
    };

    var getElement = function(selector){
        var element = new Element();
        element.ref = $(selector);
        return element;
    };

    var getCanvasContext = function(canvas){
        return canvas.ref.get(0).getContext("2d");
    };

    var createElement = function(tag, props){
        var elem = new Element(tag);
        if (props){
            elem.attr(props);
        }
        return elem;
    };

    return {
        createElement: createElement,
        getCanvasContext: getCanvasContext,
        getElement: getElement
    };
});
