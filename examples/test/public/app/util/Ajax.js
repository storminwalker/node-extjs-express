
Ext.define("FV.util.Ajax", {
    singleton: true,

	formatAPIUrl: function(url, params) {
		if(params) {
			return Ext.urlAppend((FV.app.apiUrl || "") + url, Ext.urlEncode(params));
		}
	
		return (FV.app.apiUrl || "") + url;
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
		
		FV.util.Ajax.request(config);
	},
	
	post: function(config) {
	
		config = config || {};
		config.method = config.method || "POST";
		
		FV.util.Ajax.request(config);
	}
});
