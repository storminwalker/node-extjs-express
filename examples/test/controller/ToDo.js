
Ext.define("ToDoIt.controller.ToDo", {
    extend: "ToDoIt.controller.BaseController", 
    
	models: [
		"ToDoIt.model.ToDo"
	],
	
	now: [
		"loadByIdDirect"
	],
	
	baseUrl: "/todo",
	
	// init the routing...
    init: function(app) {
        this.callParent([app]);
        
        this.get("/all", this.getAll);
        this.rest();
        /*
        this.put(this.url("/:id"), this.update);
        this.post(this.url("/"), this.create);
        */
        
        //this.post("/todo/edit", this.create);
        
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
    
    /*
    function loadUser(req, res, next) {
  // You would fetch your user from the db
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
  
  app.get('/user/:id', loadUser, function(req, res){
  res.send('Viewing user ' + req.user.name);
});
	
    update: function(res, req) {
	    console.log("controller.ToDo", "update");
    	console.log(req.body);
    },
     	app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res){
  res.send('Editing user ' + req.user.name);
});
    	app.del('/user/:id', loadUser, andRestrictTo('admin'), function(req, res){
  res.send('Deleted user ' + req.user.name);
});
    app.get('/user/:id', function(req, res, next){
	  loadUser(req.params.id, function(err, user){
		if (err) return next(err);
		res.send('Viewing user ' + user.name);
	  });
	});

}*/

	loadByIdDirect: function(id, callback) {
		console.log(arguments);
		ToDoIt.model.ToDo.load(id, {
			success: function(todo) {
				callback(null, todo);
			},
			failure: function() {
				callback("fucked up");
			}
		});
	},
    
    loadById: function(req, res, next) {
    	console.log("controller.loadTodo", req.params);
    
		ToDoIt.model.ToDo.load(req.params.id, {
			success: function(todo) {
				req.todo = todo;
				next();
			},
			failure: function() {
				this.application.send500("fucked up", res);
			}
		});
	},
	
	update: function(req, res) {
	    console.log("controller.ToDo", "update");
		
		req.todo.set(req.body);
		this.save(req.todo, req, res);
    },
    
    create: function(req, res) {
	    console.log("controller.ToDo", "create");
    	
    	var todo = Ext.create("ToDoIt.model.ToDo", req.body);
    	console.log(todo.data)
    	
    	if(Ext.isEmpty(todo.get("createdOn"))) {
    		todo.set("createdOn", new Date());
    	}
    	if(Ext.isString(todo.get("tags"))) {
    		if(Ext.isEmpty(todo.get("tags"))) {
    			todo.set("tags", []);
    		} else {
    			todo.set("tags", todo.get("tags").split(" "));
    		}
    	}
    
    	// server model only
    	todo.set("type", "todo");
    	todo.set("user_id", req.session.user._id);
    
    	this.save(todo, req, res);
    },
    
    save: function(todo, req, res) {
	    var me = this,
    		app = me.application;
    		
		todo.validate(function(valid, errors) {
    		if(valid) {
    			todo.save({
					success: function() {
						console.log(todo.data);
						me.sendModel(res, todo);
					},
					failure: function() {
						console.log(arguments);
						app.send500("The todo item could not be saved", res);
					}
				});
    		} else {
    			app.send500(errors, res);
    		}	
    	});
    },
    
    destroy: function(req, res) {
	    console.log("controller.ToDo", "destroy");
    	console.log(req.body);
    },
    
    read: function(req, res) {
    	console.log("controller.ToDo", "read");
    	this.sendModel(res, req.todo);
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
			view: "todos/all",
			key: req.session.user._id,
			callback: function() {
				this.sendStore(res, store);
			},
			scope: this
		});
    }
    /*
    
    Ext.database.Couch.instance.view("todos/all", { key: "c65fe7bc9348e5e37627643509000ccc" },
	function(err, docs) {
		console.log(docs);
	}
);

Ext.database.Couch.instance.view("todos/completed", { key: [ "c65fe7bc9348e5e37627643509000ccc", false ] },
	function(err, docs) {
		console.log(docs);
	}
);

Ext.database.Couch.instance.view("todos/by_tag", { key: ["c65fe7bc9348e5e37627643509000ccc", "test"] },
	function(err, docs) {
		console.log(docs);
	}
);

Ext.database.Couch.instance.view("todos/tags", { key: "c65fe7bc9348e5e37627643509000ccc", reduce: true },
	function(err, docs) {
		docs.forEach(function(doc) {
			console.log(doc);
		});
	}
);
    
    
    edit: function(req, res) {
    	
    
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


