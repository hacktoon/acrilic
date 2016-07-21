
ac.export("menu", function(env){
    "use strict";

    var $dialog = ac.import("dialog"),
        $tools = ac.import("tools"),
        $board = ac.import("board");

    var elem = $("#main-menu");

    var createMenu = function() {

        $('#btn-file-new').on('click', function(){
            $dialog.openNewMapDialog(function(name, horz_tiles, vert_tiles){
                ac.log(name, horz_tiles, vert_tiles);
            });
        });

        $('#btn-file-import').on('click', function(){
            $dialog.openImportDialog(function(content){
                ac.log(content);
            });
        });

        $('#btn-file-export').on('click', function(){
            ac.log("do something");
            var content = JSON.stringify({a: 3});
            $dialog.openExportDialog(content);
        });

		/*$widget.createSwitchModeHandler('.btn-tool', {
			'btn-tool-pen': 'pen',
			'btn-tool-fill': 'fill',
			'btn-tool-eraser': 'eraser'
		}, function(value){
			$tools.setTool(value);
		});

		$widget.createSwitchModeHandler('.btn-layer', {
			'btn-layer-bg': 'bg',
			'btn-layer-fg': 'fg',
			'btn-layer-event': 'event'
		}, function(value){
			$board.setLayer(value);
		});*/
	};

    return {
        elem: elem,
        createMenu: createMenu
    };
});
