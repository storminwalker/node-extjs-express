
Ext.define("ToDoIt.controller.User", {
    extend: "ToDoIt.controller.BaseController",

	models: [
		"ToDoIt.model.User"
	],

	// init the routing...
    init: function(app) {
        this.callParent([app]);
        
        app.server.post("/login", Ext.bind(this.login, this));
        
        this.get("/users", this.getAll);
    },
    
    login: function(req, res) {
    	console.log("controller.User", "login");
    	
    	var me = this;
    	
    	ToDoIt.model.User.login(req.body.userName, req.body.password, function(err, user){
    		if(err) {
    			return res.send(401, {
					success: false,
					authenticated: false,
					username: req.body.username
				});	
    		}
    		
			req.session.regenerate(function(){
				var socketSession = me.application.connectedUsers.get(req.cookies[me.application.sessionConfig.key]);
				if(socketSession) {
					socketSession.userId = user.getId();
					me.application.connectedUsers.replace(socketSession.sessionId, socketSession);
				}
				
				req.session.user = user.data;
				res.send({
					success: true,
					user: {
						sessionID: user.getId(),
						name: user.get("name"),
						userName: user.get("userName")
					}
				});
			});
  		});
    }
});
