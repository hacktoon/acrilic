
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

    var initToolsMenu = function() {
        $tools.initTools();
        registerSwitchButton('.btn-tool', function(value) {
            $tools.setTool(value);
        });
    };

    var initLayersMenu = function() {
        registerSwitchButton('.btn-layer', function(value) {
            $board.activateLayer(value);
        });
    };

    var initFileMenu = function() {
        $('#btn-file-new').on('click', function(){
            $dialog.openNewMapDialog(function(name, rows, cols){
                var map = $map.createMap(name, rows, cols);
                $board.createBoard(map);
                env.set('CURRENT_MAP', map);
            });
        });
        var map = $map.importMap({"name":"new-map","cols":10,"rows":10,"tilesize":64,"layers":[[[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2]]]});
        $board.createBoard(map);
        map.render();
        env.set('CURRENT_MAP', map);

        $('#btn-file-import').on('click', function(){
            $dialog.openImportDialog(function(content){
                try {
                    var mapData = JSON.parse(content);
                } catch (err) {
                    alert("Not a valid JSON!");
                    return;
                }
                var map = $map.importMap(mapData);
                $board.createBoard(mapData);
                map.render();
                env.set('CURRENT_MAP', map);
            });
        });

        $('#btn-file-export').on('click', function(){
            var map = env.get('CURRENT_MAP');
            if (! map){
                return;
            }
            var json = JSON.stringify($map.exportMap(map));
            $dialog.openExportDialog(json);
        });
    };

    var createMenu = function() {
        initFileMenu();
        initToolsMenu();
        initLayersMenu();
	};

    return {
        createMenu: createMenu
    };
});
