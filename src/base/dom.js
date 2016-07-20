
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

        this.html = function(elem){
            if (! elem){
                return this.obj.html();
            }
            if (typeof elem === "string") {
                this.obj.html(elem);
                return;
            }
            this.obj.html(elem.obj);
        };

        this.val = function(val){
            if (! val){
                return this.obj.val();
            }
            this.obj.val(val);
        };

        this.show = function(){
            this.obj.show();
        };

        this.hide = function(){
            this.obj.hide();
        };

        this.addClass = function(classes){
            this.obj.addClass(classes);
        };

        this.delete = function(){
            this.obj.remove();
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

        this.on = function(type, delegate, callback){
            if ($.isFunction(delegate)){
                callback = delegate;
                delegate = undefined;
            }
            this.obj.on(type, delegate, function(e){
                callback(e, this);
            });
        };
    };

    var getElement = function(selector, context){
        var element = new Element();
        if (context){
            element.obj = $(context.obj, selector);
        } else {
            element.obj = $(selector);
        }
        return element;
    };

    var getFromTemplate = function(selector){
        var element = new Element();
        element.obj = $($(selector).html());
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
        getFromTemplate: getFromTemplate,
        getCanvasContext: getCanvasContext,
        getElement: getElement
    };
});
