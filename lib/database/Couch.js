
require("./ext-overrides");

Ext.define("Ext.database.Couch", {

	singleton: true,
	
	requires: [
		"Ext.database.proxy.Couch",
		"Ext.database.proxy.CouchModel",
		"Ext.database.proxy.CouchStore"
	],
	
	/*{ 
		name: "dbname",
		host: 'localhost',
		port: 5984,
		options: { 
			cache: true, 
			raw: false 
		}
	}*/	
	init: function(config) {
		console.log(config);
		
		var cradle = require("cradle");
		cradle.setup(config); 
		
		var connection = new (cradle.Connection);
		var db = connection.database(config.name);
		
		console.log(String.format("CouchDB database '{0}' running on {1}:{2} - relax...", config.name, config.host, config.port));
		this.instance = db;
		
		return db;
	},
	
	loadModel:  function(model, id, config) {
		config = Ext.apply({}, config);
		config = Ext.applyIf(config, {
			action: 'read',
			id: id
		});
	
		var operation = Ext.create('Ext.data.Operation', config),
			scope = config.scope || this,
			record = null,
			callback;
	
		callback = function(operation) {
			if (operation.wasSuccessful()) {
				record = operation.getRecords()[0];
				Ext.callback(config.success, scope, [record, operation]);
			} else {
				Ext.callback(config.failure, scope, [record, operation]);
			}
			Ext.callback(config.callback, scope, [record, operation]);
		};
	
		var proxy = Ext.create("Ext.database.proxy.CouchModel", {
			model: model
		});
		proxy.read(operation, callback, this);
	},
	
	loadModelByView: function(model, view, key, config) {
	
		config = Ext.apply({}, config);
		config = Ext.applyIf(config, {
			action: 'read',
			view: view,
			key: key
		});
	
		var operation = Ext.create('Ext.data.Operation', config),
			scope = config.scope || this,
			record = null,
			callback;
	
		callback = function(operation) {
			if (operation.wasSuccessful()) {
				record = operation.getRecords()[0];
				Ext.callback(config.success, scope, [record, operation]);
			} else {
				Ext.callback(config.failure, scope, [record, operation]);
			}
			Ext.callback(config.callback, scope, [record, operation]);
		};
	
		var proxy = Ext.create("Ext.database.proxy.CouchStore", {
			model: model
		});
		proxy.read(operation, callback, this);
	}
});

  	
  
