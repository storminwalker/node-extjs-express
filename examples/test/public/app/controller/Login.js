
Ext.define('FV.controller.Login', {
    extend: 'Ext.app.Controller',

//    stores: ['Articles'],

  //  models: ['Article'],

    views: ["Login"],
    
    refs: [{
		ref: 'loginWindow', 
		selector: 'loginwindow', 
		autoCreate: true,
		xtype: 'loginwindow'
    }],

    init: function() {
    console.log("inited");
        this.control({
            "loginwindow": {
                login: this.onLogin
            }
        });
    },

    loadIndex: function(view) {
        var loginWindow = this.getLoginWindow();
		loginWindow.show();
    },

    onLogin: function(view, userName, password) {
    	view.setLoading("Logging in...");
    
    	FV.util.Ajax.post({
			url: "/login",
			params: {
				userName: userName,
				password: password
			},
			success: function(response) {
				view.close();
	
				var obj = Ext.decode(response.responseText)
			  	FV.app.onLogin(obj.user);  	
			},
			failure: function(response, opts) {
				view.loadMask.hide();
				view.onError(response);
			},
			scope: this
		});
    	
    }
});

