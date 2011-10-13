
Ext.define('Ext.database.proxy.Couch', {
    extend: 'Ext.data.proxy.Proxy',
	alias: 'proxy.couch',

    constructor: function(config) {
    this.guid = Guid.newGuid().toString();
    
        this.callParent([config]);

		if(! Ext.database.Couch.instance) {
		    Ext.Error.raise("Cradle is not running - it needs to be running before this proxy can be used");
        }
        
        console.log("PROXY", this.guid)
    },
    
    setModel: function(model, setOnStore) {
 //  console.log("SETTING READER", this.guid, this.model.modelName, this.reader.guid, this.reader);
        
        this.model = Ext.ModelManager.getModel(model);
        
        console.log("MODEL", this.guid, this.model.modelName);
        
        var reader = this.reader,
            writer = this.writer;
        
        this.setReader(reader);
        this.setWriter(writer);
        
        if (setOnStore && this.store) {
            this.store.setModel(this.model);
        }
    },

	setReader: function(reader) {
		var me = this;
        console.log("SETTING READER", this.guid, me.model.modelName, reader);
        
        if (reader === undefined || typeof reader == 'string') {
            reader = {
                type: reader
            };
        }

        if (reader.isReader) {
            reader.setModel(me.model);
        } else {
            Ext.applyIf(reader, {
                proxy: me,
                model: me.model,
                type : me.defaultReaderType
            });

            reader = Ext.createByAlias('reader.' + reader.type, reader);
        }
        
        me.reader = reader;
        console.log("SET READER", this.guid, me.model.modelName, reader);
        
        return me.reader;
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
    	
    	console.log(me.guid, me.getReader().guid, this.model.modelName, me.getReader().model.modelName);
    	
   		Ext.database.Couch.instance.view(operation.view, 
    		operation.key ? { key: operation.key } : undefined,
    		function(err, docs) {
    		console.log(me.guid, me.getReader().guid, me.getReader().model.modelName);
	   
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
