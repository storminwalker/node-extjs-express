
Ext.define("FV.util.JsonProxy", {
	extend: "Ext.data.proxy.Ajax",
	alias: "proxy.json",
	
	defaultReaderType: "xero-jsonreader",
	
    constructor: function(config) {
        
		config = config || {};
        /*
        config.headers = config.headers || {};
        
        Ext.applyIf(config.headers, {
            "X-Xero-SessionID": XERO.getCurrentSessionID()
        });
        
        config.url = XERO.config.apiUrl + config.url;
        */
        XERO.utils.JsonProxy.superclass.constructor.call(this, config);
        
        this.on("exception", this.onException, this);
    },
    
    doRequest: function(operation, callback, scope) {
        var writer  = this.getWriter(),
            request = this.buildRequest(operation, callback, scope);
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        Ext.apply(request, {
            headers       : this.headers,
            timeout       : this.timeout,
            scope         : this,
            callback      : this.createRequestCallback(request, operation, callback, scope),
            method        : this.getMethod(request),
            disableCaching: false // explicitly set it to false, ServerProxy handles caching
        });
        
        FV.util.Ajax.request(request);
        
        return request;
    },
    
    onException: function(request, response) {
	    console.log(response);
    	
    	var msg = "An unexpected error has occurred.";
    	if(response && response.responseText) {
    		try {
				var error = Ext.decode(response.responseText);
				msg = error.msg || "";
			} catch(err) {
				msg = "An unexpected error has occurred."
			}
    	}
    	
   		FV.app.handleError({ status: response.status, msg: msg });
    }
});
