
// add this directory to the require paths
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs-express");

require("node-extjs-express");

new Ext.express.Application({
	name: "XERO",
	appFolder: __dirname,
	
	port: 5001,
	hostname: "127.0.0.1",
	
	configureExpress: function(express, server) {
		server.use(express.logger(':method :url :status'));
		server.use(express.methodOverride());
		server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		server.use(server.router);
		server.use(express.static(__dirname + '/public'));
	},
	
  	launch: function() {
  		console.log("xeroviz test site launched");
  		
  	}
});
