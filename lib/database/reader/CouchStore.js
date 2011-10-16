
Ext.define("Ext.database.reader.CouchStore", {
	extend: "Ext.data.reader.Json",
	alias : "reader.couch.store",

	root: 'rows',
	record: 'value',
	idProperty : '_id',
	successProperty: 'ok',
	totalProperty: 'total_rows'
});

