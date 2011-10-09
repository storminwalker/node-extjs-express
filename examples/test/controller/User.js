
Ext.define('MyApp.controller.User', {
    extend: 'MyApp.controller.BaseController',

	models: [
		"MyApp.model.User"
	],

	// init the routing...
    init: function(app) {
        this.callParent([app]);
        
        app.server.post("/login", this.login);
        
        this.get("/users", this.getAll);
    },
    
    login: function(req, res) {
    	console.log("controller.User", "login");
    	
    	MyApp.model.User.login(req.body.userName, req.body.password, function(err, user){
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
    },

    // /users
    getAll: function(req, res) {
    	console.log("controller.User", "getAll");
    
	    MyApp.model.User.getAll(function(users) {
    		res.send(users);
    	});
    },
    
    // /users/:id
    show: function(req, res, next){
    	res.render({ userId: "124567890" });
	},
  
	// /users/:id/edit
  	edit: function(req, res, next){
    	res.render({ userId: "124567890" });
  	},
  
  	// PUT /users/:id
  	update: function(req, res, next){
    	res.render({ userId: "124567890" });
	} 
});
