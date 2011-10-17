
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
	    this.now = everyone.now;
	}
});
