
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs-express");

require("node-extjs-express");

new Ext.express.Application({
	name: "MyApp",
	appFolder: __dirname,
	
	controllers: [
		"User"
	],
	
	database: {
		type: "relax",
		name: "todoit",
		host: "localhost",
		port: 5984,
		options: { 
			cache: true, 
			raw: false 
		}
	},
	
  	launch: function() {
  		console.log("launched");
  	}
});
