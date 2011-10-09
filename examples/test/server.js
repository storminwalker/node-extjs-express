
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs-express");

require("node-extjs-express");

new Ext.express.Application({
	name: "ToDoIt",
	appFolder: __dirname,
	
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
  	}
});
