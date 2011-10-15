
Ext.define('Ext.database.proxy.Couch', {
    extend: 'Ext.data.proxy.Proxy',
	alias: 'proxy.couch',

    constructor: function(config) {
        this.callParent([config]);

		if(! Ext.database.Couch.instance) {
		    Ext.Error.raise("Cradle is not running - it needs to be running before this proxy can be used");
        }
    },
    
    read: function(operation, callback, scope) {
        if(operation.view) {
            this.getByView(operation, callback, scope);
        } else {
            this.getById(operation, callback, scope);
        }
    },
    
    getByView: function(operation, callback, scope) {
	    var me = this;
    	
    	// switch the reader if it can't handle views...
    	//if(this.getReader().type != "couch.store") {
	    //	this.setReader("couch.store");
    	//}
    	
   		Ext.database.Couch.instance.view(operation.view, 
    		operation.key ? { key: operation.key } : undefined,
    		function(err, docs) {
    			if(err) {
					operation.setException(err);
					me.fireEvent("exception", me, operation);
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
			}
        );
    },
    
    getById:  function(operation, callback, scope) {
    	var me = this;
    	
    	//if(this.getReader().type != "couch.model") {
	   	// 	this.setReader("couch.model");
    	//}
    	
    	Ext.database.Couch.instance.get(operation.id, 
    		function(err, doc) {
    			if(err) {
    				operation.setException(err);
                	me.fireEvent("exception", me, response, operation);
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
        	}
        );
    },
    
    create: function(operation, callback, scope) {
    	var writer  = this.getWriter(),
	        request = writer.write({ operation: operation }),
	        me = this;
    
    	Ext.database.Couch.instance.save(request.jsonData, function(err, res) {
    		if(err) {
    			operation.setException(err);
                me.fireEvent('exception', me, operation);
                
				if (typeof callback == 'function') {
					callback.call(scope || me, operation);
				}
    		} else {
    			if(res.ok === true) {
					Ext.database.Couch.instance.get(res.id, 
						function(err, doc) {
							if(err) {
								operation.setException(err);
								me.fireEvent("exception", me, response, operation);
							} else {					
								var reader = me.getReader(),
									result = reader.read(doc);
				
								Ext.apply(operation, {
									resultSet: result
								});
				
								operation.commitRecords(result.records);
								operation.setCompleted();
								operation.setSuccessful();
							}
														
							if (typeof callback == 'function') {
								callback.call(scope || me, operation);
							}
						}
					);
        		} else {
					operation.setException("This save operation was NOT OK");
					me.fireEvent('exception', this, operation);
					
		    		if (typeof callback == 'function') {
						callback.call(scope || me, operation);
					}
        		}
    		}
    		
    	});
    },
    
    update: function(operation, callback, scope) {
    	var writer  = this.getWriter(),
	        request = writer.write({ operation: operation }),
	        me = this,
	        record = operation.records[0];

    
    	Ext.database.Couch.instance.save(record.get("_id"), record.get("_rev"), request.jsonData, function(err, res) {
    		if(err) {
    			operation.setException(err);
                me.fireEvent('exception', this, operation);
                
				if (typeof callback == 'function') {
					callback.call(scope || me, operation);
				}
    		} else {
    			if(res.ok === true) {
					Ext.database.Couch.instance.get(res.id, 
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
				
								operation.commitRecords(result.records);
								operation.setCompleted();
								operation.setSuccessful();
							}
														
							if (typeof callback == 'function') {
								callback.call(scope || me, operation);
							}
						}
					);
        		} else {
					operation.setException("This save operation was NOT OK");
					me.fireEvent('exception', this, operation);
					
		    		if (typeof callback == 'function') {
						callback.call(scope || me, operation);
					}
        		}
    		}
    		
    	});
    }
});
