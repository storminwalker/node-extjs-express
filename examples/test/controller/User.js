
Ext.define("ToDoIt.controller.User", {
    extend: "ToDoIt.controller.BaseController",

	models: [
		"ToDoIt.model.User"
	],

	// init the routing...
    init: function(app) {
        this.callParent([app]);
        
        app.server.post("/login", this.login);
        
        this.get("/users", this.getAll);
    },
    
    login: function(req, res) {
    	console.log("controller.User", "login");
    	
    	ToDoIt.model.User.login(req.body.userName, req.body.password, function(err, user){
    		if (user) {
				req.session.regenerate(function(){
					req.session.user = user;
					res.send({
						success: true,
						user: user
					});
				});
			} else {
				res.send(401, {
					success: false,
					authenticated: false,
					username: req.body.username
				});	
			}
  		});
    }
});
