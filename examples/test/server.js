
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs-express");

require("node-extjs-express");

new Ext.express.Application({
	name: "ToDoIt",
	appFolder: __dirname,
	
	paths: {
		"ToDoIt.shared.model": __dirname + "/public/app/shared/model"
	},
	
	controllers: [
		"User",
		"ToDo"
	],
	
	database: {
		type: "relax",
		name: "todoit",
		host: "localhost",
		port: 5984,
		options: { 
			cache: false, 
			raw: false 
		}
	},
	
  	launch: function() {
  		console.log("ToDoIt launched");
  	
  		this.launchNow();
  	},
  	
  	launchNow: function() {
		var everyone = require("now").initialize(this.server);
	    var slice = Array.prototype.slice;
		var me = this;
		
		everyone.now.serverControllers = {
			ToDo: {
				loadMethodById: function() {
					console.log(arguments);
				}
			}
		};
		/*everyone.now.serverControllers.ToDo.loadMethodById = */
		
		everyone.now.getServerController = function(name, action){
			var args = slice.call(arguments);
			me.getController(name)[action].apply(me, args.slice(2));
		}
	}
});
