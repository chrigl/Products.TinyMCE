//(function(){tinymce.create("tinymce.plugins.Save",{init:function(a,b){var c=this;c.editor=a;a.addCommand("mceSave",c._save,c);a.addCommand("mceCancel",c._cancel,c);a.addButton("save",{title:"save.save_desc",cmd:"mceSave"});a.addButton("cancel",{title:"save.cancel_desc",cmd:"mceCancel"});a.onNodeChange.add(c._nodeChange,c);a.addShortcut("ctrl+s",a.getLang("save.save_desc"),"mceSave")},getInfo:function(){return{longname:"Save",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/save",version:tinymce.majorVersion+"."+tinymce.minorVersion}},_nodeChange:function(b,a,c){var b=this.editor;if(b.getParam("save_enablewhendirty")){a.setDisabled("save",!b.isDirty());a.setDisabled("cancel",!b.isDirty())}},_save:function(){var c=this.editor,a,e,d,b;a=tinymce.DOM.get(c.id).form||tinymce.DOM.getParent(c.id,"form");if(c.getParam("save_enablewhendirty")&&!c.isDirty()){return}tinyMCE.triggerSave();if(e=c.getParam("save_onsavecallback")){if(c.execCallback("save_onsavecallback",c)){c.startContent=tinymce.trim(c.getContent({format:"raw"}));c.nodeChanged()}return}if(a){c.isNotDirty=true;if(a.onsubmit==null||a.onsubmit()!=false){a.submit()}c.nodeChanged()}else{c.windowManager.alert("Error: No form element found.")}},_cancel:function(){var a=this.editor,c,b=tinymce.trim(a.startContent);if(c=a.getParam("save_oncancelcallback")){a.execCallback("save_oncancelcallback",a);return}a.setContent(b);a.undoManager.clear();a.nodeChanged()}});tinymce.PluginManager.add("save",tinymce.plugins.Save)})();

/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	tinymce.create('tinymce.plugins.Save', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			// Register commands
		        // The normal TinyMCE registration
			//ed.addCommand('mceSave', t._save, t);

		    // PLEASE NOTE that this is a completely custom
		    // asychronous 'save' function that does not exist as part
		    // of the normal TinyMCE distribution.
		    // As a result, none of the other functions listed below
		    // this init method are actually used.
		    ed.addCommand('mceSave', function() {
			var id = ed.id;
			if (ed.id == 'mce_fullscreen') {
			    id = ed.settings.fullscreen_editor_id;
			}
			tinymce.util.XHR.send({
			    url : ed.settings.document_url + '/tinymce-save',
			    content_type : "application/x-www-form-urlencoded",
			    type : "POST",
			    data : "text=" + encodeURIComponent(ed.getContent()) + "&fieldname=" + id,
			    success : function( data, req, o ) {
				if (!tinymce.isIE) {
				    tinymce.DOM.addClass(tinymce.DOM.get(ed.id + '_tbl'), 'mceEditorSave');
				    window.setTimeout(function() {
					tinymce.DOM.removeClass(tinymce.DOM.get(ed.id + '_tbl'), 'mceEditorSave');
					tinymce.DOM.removeClass(tinymce.DOM.get(ed.id + '_tbl'), 'mceEditorFocus');
					tinymce.DOM.addClass(tinymce.DOM.get(ed.id + '_tbl'), 'mceEditorFocus');
				    }, 500);
				}
				tinymce.DOM.add(document.body, 'div', {id: 'mceSaveMessage', 'class' : 'mceSaveMessage'}, 'Document saved.');
				window.setTimeout(function () {
				    tinymce.DOM.remove('mceSaveMessage');
				}, 1000);
			    }
			});
		    });
			ed.addCommand('mceCancel', t._cancel, t);

			// Register buttons
			ed.addButton('save', {title : 'save.save_desc', cmd : 'mceSave'});
			ed.addButton('cancel', {title : 'save.cancel_desc', cmd : 'mceCancel'});

			ed.onNodeChange.add(t._nodeChange, t);
			ed.addShortcut('ctrl+s', ed.getLang('save.save_desc'), 'mceSave');
		},

		getInfo : function() {
			return {
				longname : 'Save',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/save',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private methods

		_nodeChange : function(ed, cm, n) {
			var ed = this.editor;

			if (ed.getParam('save_enablewhendirty')) {
				cm.setDisabled('save', !ed.isDirty());
				cm.setDisabled('cancel', !ed.isDirty());
			}
		},

		// Private methods

		_save : function() {
			var ed = this.editor, formObj, os, i, elementId;

			formObj = tinymce.DOM.get(ed.id).form || tinymce.DOM.getParent(ed.id, 'form');

			if (ed.getParam("save_enablewhendirty") && !ed.isDirty())
				return;

			tinyMCE.triggerSave();

			// Use callback instead
			if (os = ed.getParam("save_onsavecallback")) {
				if (ed.execCallback('save_onsavecallback', ed)) {
					ed.startContent = tinymce.trim(ed.getContent({format : 'raw'}));
					ed.nodeChanged();
				}

				return;
			}

			if (formObj) {
				ed.isNotDirty = true;

				if (formObj.onsubmit == null || formObj.onsubmit() != false){
				    alert('not yet submitted');
					formObj.submit();
				    alert('submitted');
				}

				ed.nodeChanged();
			} else
				ed.windowManager.alert("Error: No form element found.");
		},

		_cancel : function() {
			var ed = this.editor, os, h = tinymce.trim(ed.startContent);

			// Use callback instead
			if (os = ed.getParam("save_oncancelcallback")) {
				ed.execCallback('save_oncancelcallback', ed);
				return;
			}

			ed.setContent(h);
			ed.undoManager.clear();
			ed.nodeChanged();
		}
	});

	// Register plugin
	tinymce.PluginManager.add('save', tinymce.plugins.Save);
})();