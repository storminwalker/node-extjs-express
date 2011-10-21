
Ext.define("ToDoIt.controller.ToDo", {
    extend: "ToDoIt.controller.BaseController", 
    
	models: [
		"ToDoIt.model.ToDo"
	],
	
	baseUrl: "/todo",
	
	// init the routing...
    init: function(app) {
        this.callParent([app]);
        
        this.get("/all", this.getAll); // basic route for all store requests

        this.get("/tags", this.getTagCloud); // route for the tag cloud

        this.post("/complete", this.complete); // route for setting completed quickly

        this.rest(); // setting up the controller to handle any RESTful request
    },
    
	loadByIdDirect: function(id, callback) {
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
    			todo.set("tags", todo.get("tags").split(",").map(function(tag) {
    				return tag.trim();
    			}));
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
    	
    	if(req.query && (typeof req.query.completed != "undefined")) {
    		this.getByCompleted(req, res); 
    	} else if (req.query && req.query.tag) {
    	    this.getByTag(req, res); 
    	} else {
	    	this.loadToDos("todos/all", req.session.user._id, res);	
    	}	
    },
    
    getByCompleted: function(req, res) {
    	console.log("controller.ToDo", "getByCompleted");
    	
    	this.loadToDos("todos/completed", [ req.session.user._id, (req.query.completed == "true") ], res);
    },	
    
    getByTag: function(req, res) {
    	console.log("controller.ToDo", "getByTag");
    	
    	this.loadToDos("todos/by_tag", [ req.session.user._id, req.query.tag ], res);
    },
    
    getTagCloud: function(req, res) {
    	Ext.database.Couch.instance.view("todos/tags", { key: req.session.user._id, reduce: true },
			function(err, docs) {
				res.send(docs);
			}
		);
    },
    
    complete: function(req, res) {
    	console.log("controller.ToDo", "setCompleted");
    
    	this.setCompleted(req.body, function(result) {
    		res.send(result);
    	});
    },
    
    setCompleted: function(toComplete, callback) {
    	var waiting = toComplete.length;

		function complete() {
			if (!waiting) {
			   callback({ success: true });
			}
		}

    	toComplete.forEach(function(data) {
    		Ext.database.Couch.instance.merge(data.id, { completed: data.completed }, function(err, doc) {
    			waiting--;
    			complete();
    		});
    	});
    },
    
    loadToDos: function(view, key, res) {
     	var store = Ext.create("Ext.data.Store", {
			model: "ToDoIt.model.ToDo",
			
			proxy: {
				type: 'couch.store'
			}
		});
    	
    	store.load({
			view: view,
			key: key,
			callback: function() {
				this.sendStore(res, store);
			},
			scope: this
		});
    },
    
	now: [
		"loadByIdDirect",
		"setCompleted"
	]
});


