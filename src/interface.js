
AC.interface = (function(){
	"use strict";
	
	return {

		buildDialogButtons: function(dialog, buttonSet){
			var output = '';
			for (var i=0; i<buttonSet.length; i++){
				var btn = buttonSet[i],
					id = 'btn-' + btn.title.replace(/\s+/g, '-').toLowerCase();
				output += '<button id="' + id + '">' + btn.title + '</button>';
				dialog.on('click', '#' + id, btn.action);
			}
			return output;
		},

		closeDialog: function(){
			$('#dialog-overlay').remove();
		},

		openDialog: function(title, content, buttonSet){
			var self = this;
			var dialog = $($('#tpl-dialog-overlay').html()),
				dialogContent = dialog.find('#dialog-content'),
				dialogButtonSet = dialog.find('#dialog-button-panel');

			dialog.find('.btn-close').on('click', function(){
				self.closeDialog();
			});
			dialog.find('#dialog-titlebar .title').html(title);
			dialogContent.html(content);
			dialogButtonSet.html(this.buildDialogButtons(dialog, buttonSet));
			dialog.appendTo('body').show();
		},

		createDialogHandler: function(options){
			var self = this,
				opt = options || {},
				templateString = $(opt.templateSelector).html();
			$(opt.btnSelector).on('click', function(){
				self.openDialog(opt.title, $(templateString), opt.buttonSet);
			});
		},

		createSwitchModeHandler: function(generalSelector, options){
			var toggleClass = 'active',
				optionList = $(generalSelector);
			
			optionList.on('click', function(e){
				optionList.removeClass(toggleClass);
				var target = $(this),
					id = '#' + target.attr('id'),
					value = options[id];
				target.addClass(toggleClass);
			});
		},

		init: function(){
			var self = this;

			this.createDialogHandler({
				title: 'New map',
				btnSelector: '#btn-file-new',
				templateSelector: '#tpl-dialog-file-new',
				buttonSet: [
					{title: 'OK', action: function(){
						alert('OK');
					}},
					{title: 'Cancel', action: function(){
						self.closeDialog();
					}}
				]
			});

			this.createDialogHandler({
				title: 'Import',
				btnSelector: '#btn-file-import',
				templateSelector: '#tpl-dialog-file-import',
				buttonSet: [
					{title: 'Import', action: function(){
						$('#field-file-import-output').val();
					}},
					{title: 'Cancel', action: function(){
						self.closeDialog();
					}}
				]
			});

			this.createDialogHandler({
				title: 'Export',
				btnSelector: '#btn-file-export',
				templateSelector: '#tpl-dialog-file-export',
				buttonSet: [
					{title: 'Close', action: function(){
						self.closeDialog();
					}}
				]
			});

			this.createSwitchModeHandler('.btn-tool', {
				'#btn-tool-pen': 'pen',
				'#btn-tool-fill': 'fill',
				'#btn-tool-eraser': 'eraser'
			});

			this.createSwitchModeHandler('.btn-layer', {
				'#btn-layer-bg': 'bg',
				'#btn-layer-fg': 'fg',
				'#btn-layer-event': 'event'
			});

			$('#btn-tool-pen, #btn-layer-bg').trigger('click');
		}
    };

})();
