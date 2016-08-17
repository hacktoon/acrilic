
ac.export("menu", function(env){
    "use strict";

    ac.import("dialog", "map", "board");

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
        registerSwitchButton('.btn-tool', function(value) {
            env.set("CURRENT_TOOL", value);
        });
    };

    var initLayersMenu = function() {
        registerSwitchButton('.btn-layer', function(value) {
            var map = env.get("CURRENT_MAP");
            env.set("CURRENT_LAYER", value);
            if (map){
                map.activateLayer(value);
            }
        });
    };

    var initFileMenu = function() {
        $('#btn-file-new').on('click', function(){
            ac.dialog.openNewMapDialog(function(name, rows, cols){
                var map = ac.map.createMap(name, rows, cols);
                ac.board.createBoard(map);
                env.set('CURRENT_MAP', map);
            });
        });

        $('#btn-file-import').on('click', function(){
            ac.dialog.openImportDialog(function(content){
                try {
                    var mapData = JSON.parse(content);
                } catch (err) {
                    alert("Not a valid JSON!");
                    return;
                }
                var map = ac.map.importMap(mapData);
                ac.board.createBoard(map);
                env.set('CURRENT_MAP', map);
            });
        });

        $('#btn-file-export').on('click', function(){
            var map = env.get('CURRENT_MAP');
            if (! map){
                return;
            }
            var json = JSON.stringify(ac.map.exportMap(map));
            ac.dialog.openExportDialog(json);
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
