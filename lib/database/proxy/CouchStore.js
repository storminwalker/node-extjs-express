
Ext.define("Ext.database.reader.CouchStore", {
	extend: "Ext.data.reader.Json",
	alias : "reader.couch.store",

/*
	constructor: function(config) {
	this.guid = Guid.newGuid().toString();
	
        var me = this;
        
        Ext.apply(me, config || {});
        me.fieldCount = 0;
        me.model = Ext.ModelManager.getModel(config.model);
        
        console.log("constructing reader", this.$className, this.proxy.guid, config.model.modelName, me.model.modelName);
        if (me.model) {
            me.buildExtractors();
        }
    },

    
    setModel: function(model, setOnProxy) {
        var me = this;
        
        me.model = Ext.ModelManager.getModel(model);
        me.buildExtractors(true);
        
        if (setOnProxy && me.proxy) {
            me.proxy.setModel(me.model, true);
        }
    },
    
    read: function(response) {
    console.log(response);
    
        var data = response;
        
        if (response && response.responseText) {
            data = this.getResponseData(response);
        }
        
        if (data) {
            return this.readRecords(data);
        } else {
            return this.nullResultSet;
        }
    },

    
    readRecords: function(data) {
        var me  = this;
        
      
        if (me.fieldCount !== me.getFields().length) {
            me.buildExtractors(true);
        }
        
       
        me.rawData = data;

        data = me.getData(data);

        // If we pass an array as the data, we dont use getRoot on the data.
        // Instead the root equals to the data.
        var root    = Ext.isArray(data) ? data : me.getRoot(data),
            success = true,
            recordCount = 0,
            total, value, records, message;
            
        if (root) {
            total = root.length;
        }

        if (me.totalProperty) {
            value = parseInt(me.getTotal(data), 10);
            if (!isNaN(value)) {
                total = value;
            }
        }

        if (me.successProperty) {
            value = me.getSuccess(data);
            if (value === false || value === 'false') {
                success = false;
            }
        }
        
        if (me.messageProperty) {
            message = me.getMessage(data);
        }
        
        if (root) {
            records = me.extractData(root);
            recordCount = records.length;
        } else {
            recordCount = 0;
            records = [];
        }

        return Ext.create('Ext.data.ResultSet', {
            total  : total || recordCount,
            count  : recordCount,
            records: records,
            success: success,
            message: message
        });
    },
    
	extractData : function(root) {
        var me = this,
            values  = [],
            records = [],
            Model   = me.model,
            i       = 0,
            length  = root.length,
            idProp  = me.getIdProperty(),
            node, id, record;
            
        if (!root.length && Ext.isObject(root)) {
            root = [root];
            length = 1;
        }

        for (; i < length; i++) {
            node   = root[i];
            values = me.extractValues(node);
            id     = me.getId(node);

            
            record = new Model(values, id, node);
            
            console.log("CLASSNAME", this.type, this.guid, record.$className);
            
            records.push(record);
                
            if (me.implicitIncludes) {
                me.readAssociated(record, node);
            }
        }

        return records;
    },

*/
	root: 'rows',
	record: 'value',
	idProperty : '_id',
	successProperty: 'ok',
	totalProperty: 'total_rows'
});


Ext.define("Ext.database.proxy.CouchStore", {
    extend: "Ext.database.proxy.Couch",
	alias: "proxy.couch.store",
	
	defaultReaderType: "couch.store",
	
	writer: {
		allowSingle: true,
		encode: false,
		writeAllFields: true,
		root: ''
	}
});
    
