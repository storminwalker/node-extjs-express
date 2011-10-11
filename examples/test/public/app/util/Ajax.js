
Ext.define("ToDoIt.util.Ajax", {
    singleton: true,

	formatAPIUrl: function(url, params) {
		if(params) {
			return Ext.urlAppend((ToDoIt.app.apiUrl || "") + url, Ext.urlEncode(params));
		}
	
		return (ToDoIt.app.apiUrl || "") + url;
	},

	request: function(config) {
	
		config = config || {};
		
		config.headers = config.headers || {};
		config.url = (config.apiUrl || "") + config.url;
		config.method = config.method || "GET";
		config.timeout = config.timeout || (60 * 1000);
		
		Ext.Ajax.request(config);
	},
	
	get: function(config) {
	
		config = config || {};
		config.method = config.method || "GET";
		
		ToDoIt.util.Ajax.request(config);
	},
	
	post: function(config) {
	
		config = config || {};
		config.method = config.method || "POST";
		
		ToDoIt.util.Ajax.request(config);
	}
});
