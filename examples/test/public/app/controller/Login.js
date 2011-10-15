
Ext.define('ToDoIt.controller.Login', {
    extend: 'Ext.app.Controller',

    views: ["Login"],
    
    refs: [{
		ref: 'loginWindow', 
		selector: 'loginwindow', 
		autoCreate: true,
		xtype: 'loginwindow'
    }],

    init: function() {
        this.control({
            "loginwindow": {
                login: this.onLogin,
                show: this.onLoginShow
            }
        });
    },

    loadIndex: function(view) {
        var loginWindow = this.getLoginWindow();
		loginWindow.show();
    },

	onLoginShow: function(view) {
		var loginWindow = this.getLoginWindow();
		
		loginWindow.passwordField.setValue("");
		
		var user = ToDoIt.app.getLocalUserSettings();
		if(user && user.userName) {
			loginWindow.userNameField.setValue(user.userName);
			loginWindow.passwordField.focus();
		} else {
			loginWindow.userNameField.setValue("");
			loginWindow.userNameField.focus();
		}
		
	},

    onLogin: function(view, userName, password) {
    	view.setLoading("Logging in...");
    
    	ToDoIt.util.Ajax.post({
			url: "/login",
			params: {
				userName: userName,
				password: password
			},
			success: function(response) {
				view.loadMask.hide();
				view.close();
				
				var obj = Ext.decode(response.responseText)
				ToDoIt.app.onLogin(obj.user);  	
			},
			failure: function(response, opts) {
				view.loadMask.hide();
				view.onError(response);
			},
			scope: this
		});
    }
});

