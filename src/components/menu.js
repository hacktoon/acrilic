
ac.export("menu", function(env){
    "use strict";

    var $dialog = ac.import("dialog"),
        $tools = ac.import("tools"),
        $map = ac.import("map"),
        $board = ac.import("board");

    var registerSwitchButton = function(selector, action) {
        var activeClass = 'active',
            element = $(selector);

        element.on('click', function(e){
            var target = $(e.target);
            element.removeClass(activeClass);
            target.addClass(activeClass);
            action(target.data('value'));
        }).first().trigger('click');
    };

    var createMenu = function() {

        /*$('#btn-file-new').on('click', function(){
            $dialog.openNewMapDialog(function(name, horz_tiles, vert_tiles){
                var map = $map.createMap(name, horz_tiles, vert_tiles);
                $board.createBoard(map, horz_tiles, vert_tiles);
                env.set('CURRENT_MAP', map);
            });
        }).trigger('click');*/
        var map = $map.loadMap({"name":"weh","width":9,"height":8,"grid":[[{"bg":0},{"bg":0},{"bg":0},{"bg":0},{"bg":0},{"bg":0},{"bg":1},{"bg":3},{"bg":4}],[{"bg":0},{"bg":0},{"bg":0},{"bg":0},{"bg":0},{"bg":1},{"bg":3},{"bg":3},{"bg":4}],[{"bg":0},{"bg":0},{"bg":0},{"bg":0},{"bg":3},{"bg":3},{"bg":3},{"bg":4},{"bg":4}],[{"bg":0},{"bg":1},{"bg":1},{"bg":3},{"bg":3},{"bg":4},{"bg":4},{"bg":4},{"bg":4}],[{"bg":1},{"bg":3},{"bg":3},{"bg":3},{"bg":4},{"bg":4},{"bg":4},{"bg":2},{"bg":2}],[{"bg":3},{"bg":3},{"bg":4},{"bg":4},{"bg":4},{"bg":2},{"bg":2},{"bg":2},{"bg":7}],[{"bg":4},{"bg":4},{"bg":4},{"bg":4},{"bg":2},{"bg":2},{"bg":2},{"bg":7},{"bg":7}],[{"bg":4},{"bg":4},{"bg":4},{"bg":2},{"bg":2},{"bg":7},{"bg":7},{"bg":7},{"bg":7}]]});
        $board.createBoard(map, 9, 8);
        $board.renderMap(map);
        env.set('CURRENT_MAP', map);

        $('#btn-file-import').on('click', function(){
            $dialog.openImportDialog(function(content){
                try {
                    var obj = JSON.parse(content);
                } catch (err) {
                    alert("Not a valid JSON!");
                    return;
                }
                var map = $map.loadMap(obj);
                $board.createBoard(map, obj.width, obj.height);
                $board.renderMap(map);
                env.set('CURRENT_MAP', map);
            });
        });

        $('#btn-file-export').on('click', function(){
            var map = env.get('CURRENT_MAP');
            if (! map){
                return;
            }
            var json = JSON.stringify(map.getData());
            $dialog.openExportDialog(json);
        });

        registerSwitchButton('.btn-tool', function(value) {
            $tools.setTool(value);
        });

        registerSwitchButton('.btn-layer', function(value) {
            $board.activateLayer(value);
        });
	};

    return {
        createMenu: createMenu
    };
});
