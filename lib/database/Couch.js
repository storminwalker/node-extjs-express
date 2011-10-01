
/*
var 
cradle.setup({ 
				host: 'localhost',
				port: 5984,
				options: { 
					cache: true, 
					raw: false 
				}
			});,
			*/
Ext.define("Ext.database.Couch", {

	singleton: true,
	
	/*constructor: function() {
		this.callParent(arguments);
		
		this.cradle = require("cradle");
	},
	*/
	init: function(config) {
		console.log(config);
		var cradle = require("cradle");
		cradle.setup(config); 
		
		var connection = new (cradle.Connection);
		var db = connection.database(config.name);
		
		this.instance = db;
		
		console.log(String.format("CouchDB database '{0}' running on {1}:{2} - relax...", config.name, config.host, config.port));
		return this.instance;
	}
});

  	
  
