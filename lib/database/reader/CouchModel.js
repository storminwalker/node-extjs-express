
Ext.define("Ext.database.reader.CouchModel", {
	extend: "Ext.data.reader.Json",
	alias : "reader.couch.model",

	idProperty : '_id',
	successProperty: 'ok'
});
