
Ext.define("Ext.database.reader.CouchModel", {
	extend: "Ext.data.reader.Json",
	alias : "reader.couch.model",

	idProperty : '_id',
	successProperty: 'ok'
});

Ext.define("Ext.database.proxy.CouchModel", {
    extend: "Ext.database.proxy.Couch",
	alias: "proxy.couch.model",
	
	reader: {
		type: 'couch.model'
	},
	
	writer: {
		allowSingle: true,
		encode: false,
		writeAllFields: true,
		root: ''
	}
});


