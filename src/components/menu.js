
ac.export("menu", function(env){
    "use strict";

    var $dialog = ac.import("dialog"),
        $tools = ac.import("tools"),
        $board = ac.import("board"),
        $widget = ac.import("widget");

    var createMenu = function() {

        $widget.setButton('#btn-file-new', function(){
            $dialog.createFormDialog("New map", {
    			templateSelector: '#tpl-dialog-file-new',
    			buttonSet: [
                    $widget.createButton('OK', function(dialog){
                        ac.log("clicquei no OK");
                        /*var name = $dom.getElement('#field-file-new-name').val(),
                            width = Number($dom.getElement('#field-file-new-width').val()),
                            height = Number($dom.getElement('#field-file-new-height').val());
                        dialog.close();*/
                    }),
    				$widget.createButton('Cancel', function(dialog){
                        ac.log("cliquei no cancel");
    					//dialog.close();
    				})
    			]
    		});
        });

		/*$widget.createDialogHandler('Import', {
			btnSelector: '#btn-file-import',
			templateSelector: '#tpl-dialog-file-import',
			buttonSet: [
				{
					title: 'Import',
					action: function(dialog){
						$('#field-file-import-map').val();
					}
				},
				{
					title: 'Cancel',
					action: function(dialog){
						dialog.close();
					}
				}
			]
		});

		$widget.createDialogHandler('Export', {
			btnSelector: '#btn-file-export',
			templateSelector: '#tpl-dialog-file-export',
			buttonSet: [
				{
					title: 'Close',
					action: function(dialog){
						dialog.close();
					}
				}
			],
			initialize: function(){
				var json = JSON.stringify({a: 3});
				$("#field-file-export-map").val(json);
			},
		});*/

		$widget.createSwitchModeHandler('.btn-tool', {
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
		});
	};

    return {
        createMenu: createMenu
    };
});
