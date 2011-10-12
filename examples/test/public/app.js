
Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
    name: "ToDoIt",

	paths: {
		'Ext.ux': './app/ux'
	},
	
	requires: [
		"ToDoIt.util.Ajax",
		"ToDoIt.util.JsonProxy"
	],
	
    // Define all the controllers that should initialize at boot up of your application
    controllers: [
    	"Login",
    	"Feeds",
        "ToDo"
    ],
    	
    launch: function() {
    	ToDoIt.app = this;
    	
    	if(! this.isLoggedIn()) {
    		this.getController("Login").loadIndex();
    	}
    },
    
    autoCreateViewport: true,
    
    setCurrentUser: function(user) {	
		this.currentUser = user;
		
		// save to session
		window.sessionStorage.setItem("session", Ext.encode(this.currentUser));
		
		this.updateLocalUserSettings({ userName: this.currentUser.userName });
	},

	isLoggedIn: function() {
		return !(Ext.isEmpty(this.getCurrentSessionID()));
	},
	
	getCurrentSessionID: function() {
		var user = this.getCurrentUser();
		return (user) ? user.sessionID : null;
	},
	
	getCurrentUser: function() {
		var user = null;
		
		if(this.currentUser) {
			return this.currentUser;
		}
		
		// else need to hydate from sessionstorage
		if(window.sessionStorage.getItem("session")) {
			user = Ext.decode(window.sessionStorage.getItem("session"));
		}
		
		if(user) {
			this.currentUser = user;
			return this.currentUser;
		}
		return null;
	},
	
	onUnauthenticated: function() {
		this.getController("Login").loadIndex();
	},
	
	onLogin: function(user) {
		this.setCurrentUser(user);	
		
		ToDoIt.app.getController("Feeds").onLaunch();
	},
	
	killSession: function() {
		sessionStorage.removeItem("session");
		this.currentUser = null;
	},
	
	handleError: function(error) {
		Ext.MaskMgr.each(function(key, item) { if(item) { item.hide() } })
		
		if(error.status && error.status == 401) {
			this.onUnauthenticated();
		} else {
			title = error.title || "Error"; //(error.status) ? error.status : "Error";
			Ext.Msg.alert(title, error.msg);
		}
	},

	getLocalUserSettings: function() {
		var user = { };
		if(window.localStorage.getItem("user")) {
			try {
				Ext.apply(user, Ext.decode(window.localStorage.getItem("user")));
			} catch(err) { }
		}
		return Ext.applyIf(user, { 
			userName: null
		});
	},
	
	updateLocalUserSettings: function(newUser) {
		var user = this.getLocalUserSettings();
		Ext.apply(user, newUser);
		window.localStorage.setItem("user", Ext.encode(user));
	}
});

