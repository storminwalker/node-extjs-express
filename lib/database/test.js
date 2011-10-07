

require("node-extjs");

require("./Couch");

Ext.database.Couch.init({
	type: "relax",
	name: "wdcnz",
	host: "localhost",
	port: 5984,
	options: { 
		cache: true, 
		raw: false 
	}
});
   
Ext.define('Ext.database.Couch.Proxy', {
    extend: 'Ext.data.proxy.Proxy',
	alias: 'proxy.couch',

    constructor: function(config) {
        this.callParent([config]);

		if(! Ext.database.Couch.instance) {
		    Ext.Error.raise("Cradle is not running - it needs to be running before this proxy can be used");
        }
    },

	readById:  function(operation, callback, scope) {
    	var me = this;
    	
    	Ext.database.Couch.instance.get(operation.id, 
    		function(err, doc) {
    			if(err) {
    				operation.setException(err);
                	me.fireEvent("exception", this, response, operation);
				} else {					
					var reader = me.getReader(),
						result = reader.read(doc);
	
					Ext.apply(operation, {
						resultSet: result
					});
	
					operation.setCompleted();
					operation.setSuccessful();
				}
				if (typeof callback == 'function') {
					return callback.call(scope || me, operation);
				}
        });
    },
    
    read: function(operation, callback, scope) {
    	var me = this;
    	
    	Ext.database.Couch.instance.view(operation.view, 
    		operation.key ? { key: operation.key } : undefined,
    		function(err, docs) {
    			if(err) {
    				operation.setException(err);
                	me.fireEvent("exception", this, response, operation);
				} else {					
					var reader = me.getReader(),
						result = reader.read(docs);
	
					Ext.apply(operation, {
						resultSet: result
					});
	
					operation.setCompleted();
					operation.setSuccessful();
				}
				if (typeof callback == 'function') {
					return callback.call(scope || me, operation);
				}
        });
    }
});

Ext.define('Ext.database.Couch.Model', {
    extend: 'Ext.data.Model',
    
    inheritableStatics: {
    	load: function(id, config) {
            config = Ext.apply({}, config);
            config = Ext.applyIf(config, {
                action: 'read',
                id    : id
            });

            var operation  = Ext.create('Ext.data.Operation', config),
                scope      = config.scope || this,
                record     = null,
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

            this.proxy.readById(operation, callback, this);
        }
    },
    
    proxy: {
        type: 'couch',
        
        reader: {
			type: 'json',
			idProperty : '_id'
		},
		
		writer: {
			allowSingle: true,
			encode: false,
			writeAllFields: true,
			root: ''
		}
	}
});
    
Ext.define('User', {
    extend: 'Ext.database.Couch.Model',
    fields: ['title', 'name', 'synopsis'],
    getSynopsisWordCount: function() {
    	return this.get("synopsis").split(" ").length;
    }
});

Ext.define('Ext.database.Couch.Store', {
    extend: 'Ext.data.Store',
    
    proxy: {
        type: 'couch',
        
        reader: {
			type: 'json',
			root: 'rows',
			record: 'value',
			idProperty : '_id',
			successProperty: 'ok',
			totalProperty: 'total_rows'
		},
		
		writer: {
			allowSingle: true,
			encode: false,
			writeAllFields: true,
			root: ''
		}
	}
});

var store = Ext.create('Ext.database.Couch.Store', {
    model: 'User'
});
/*
Ext.database.Couch.instance.get("a9b5fd915110ea7d6c4b718384002df4", function(err, doc) {
	console.log(doc);
});
Ext.database.Couch.instance.view("speakers/all", { key: "a9b5fd915110ea7d6c4b718384002df4" }, function(err, docs) {
	console.log(docs);
});*/
/*Ext.database.Couch.instance.view("speakers/all", function(err, docs) {
	console.log(docs.total_rows);
});*/

User.load("a9b5fd915110ea7d6c4b718384002df4", {
	callback: function() {
		console.log(arguments);
	}
});

store.load({
	view: "speakers/all",
	callback: function() {
		store.each(function(doc) {
			console.log(doc.getSynopsisWordCount());
		});
	}
});


