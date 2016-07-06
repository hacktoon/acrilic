
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

        this.style = function(props) {
            this.obj.css(props);
        };

        this.getPosition = function(coordinate){
            var offset = this.obj.offset();
            coordinate = coordinate.toLowerCase();
            if (coordinate == "left"){
                return offset.left;
            }
            if (coordinate == "top"){
                return offset.top;
            }
        };

        this.getScroll = function(coordinate){
            coordinate = coordinate.toLowerCase();
            if (coordinate == "left"){
                return this.obj.scrollLeft();
            }
            if (coordinate == "top"){
                return this.obj.scrollTop();
            }
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
