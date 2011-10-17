
Ext.define("ToDoIt.controller.BaseController", {
    extend: "Ext.app.Controller",

	onLaunch: function() {
		this.launchNow();
	},
	
	launchNow: function() {
		var slice = Array.prototype.slice,
			me = this,
			app = me.application,
			methods = Ext.Array.from(this.now),
            ln = methods && methods.length,
            i, 
            method;

		if(app.now && ln > 0 && this.id) {
			var obj = {};
			for (i = 0; i < ln; i++) {
				obj[methods[i]] = this[methods[i]];
			}
			
			app.now[this.id + "Client"] = obj;	
		}
		/*
		everyone.now.getServerController = function(name, action){
			var args = slice.call(arguments);
			me.getController(name)[action].apply(me, args.slice(2));
		}
		*/
	}
});
	
	
