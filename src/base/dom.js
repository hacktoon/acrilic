
ac.export("dom", function(env){
    "use strict";

    function Element(tagName){
        (function init(){
            if (tagName){
                this.obj = $("<"+tagName+"/>");
            }
        }.bind(this))();

        this.append = function(child){
            var items = child.obj;
            if (Array.isArray(child)){
                items = [];
                child.forEach(function(item, _){
                    items.push(item.obj);
                });
            }
            this.obj.append(items);
        };

        this.attr = function(props){
            this.obj.attr(props);
        };

        this.addClass = function(classes){
            this.obj.addClass(classes);
        };

        this.removeClass = function(classes){
            this.obj.removeClass(classes);
        };

        this.on = function(type, callback){
            this.obj.on(type, function(e){
                callback(e, this);
            });
        };
    };

    var getElement = function(selector){
        var element = new Element();
        element.obj = $(selector);
        return element;
    };

    var getCanvasContext = function(canvas){
        ac.log(canvas.obj);
        return canvas.obj.get(0).getContext("2d");
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
