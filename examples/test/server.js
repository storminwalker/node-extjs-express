
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs-express");

require("node-extjs-express");

new Ext.express.Application({
	name: 'MyApp',
	appFolder: __dirname,
	
  	launch: function() {
  		console.log("launched");
  	}
});
