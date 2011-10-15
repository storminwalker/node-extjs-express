
Ext.define("Ext.database.reader.CouchStore", {
	extend: "Ext.data.reader.Json",
	alias : "reader.couch.store",

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
    
