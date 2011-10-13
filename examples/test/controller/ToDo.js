
Ext.define("ToDoIt.controller.ToDo", {
    extend: "ToDoIt.controller.BaseController", 
    
	models: [
		"ToDoIt.model.ToDo"
	],

	// init the routing...
    init: function(app) {
        this.callParent([app]);
        this.get("/todo/all", this.getAll);
        
        /*
        app.param('userId', function(req, res, next, id){
  User.get(id, function(err, user){
    if (err) return next(err);
    if (!user) return next(new Error('failed to find user'));
    req.user = user;
    next();
  });
});*/
        
    },
    
    getAll: function(req, res) {
    	console.log("controller.ToDo", "getAll");
    	
		var store = Ext.create("Ext.data.Store", {
			model: "ToDoIt.model.ToDo",
			
			proxy: {
				type: 'couch.store'
			}
		});
    	
    	store.load({
			view: "todo/all",
			//key: ,
			callback: function() {
				this.send(res, store);
			},
			scope: this
		});
		
    } 
    /*
    // /users
    getAll: function(req, res) {
    	console.log("controller.User", "getAll");
    
	    ToDoIt.model.User.getAll(function(users) {
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
	*/
});


