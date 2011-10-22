
Ext.define("ToDoIt.controller.Daemon", {
    extend: "ToDoIt.controller.BaseController", 

	// init the routing...
    init: function(app) {
        this.callParent([app]);
        
        app.server.get("/process/overdues", 
        	Ext.bind(this.processOverdues, this));     
    },
    
    processOverdues: function(req, res) {
		res.send({ status: "processing" });
				
    	var me = this;
    	var store = Ext.create("Ext.data.Store", {
			model: "ToDoIt.model.User",
			
			proxy: {
				type: "couch.store"
			}
		});
		
		store.load({
			view: "users/all",
			callback: function() {
				store.each(function(user) {
					me.loadToDos(user.getId(), res);
				}, me);
			},
			scope: me
		});
    },
    
    loadToDos: function(userId, res) {
  		var store = Ext.create("Ext.data.Store", {
			model: "ToDoIt.model.ToDo",
			
			proxy: {
				type: "couch.store"
			}
		});
    	
    	store.load({
			view: "todos/completed",
			key: [ userId, false ],
			callback: function() {
				var ids = [];
				store.each(function(record) {
					if(record.get("dueOn") < 
						Ext.Date.clearTime(new Date())) {
						ids.push(record.getId());
					}
				}, this);
				
				if(ids.length > 0) {
					console.log(ids.length + " overdue!");
					this.sendToClient(userId, ids);
				}
			},
			scope: this
		}); 
    },
    
    sendToClient: function(userId, ids) {
    	var me = this,
    		app = me.application;
    	
	    var socket = app.connectedUsers.findBy(function(item) {
			return (item.userId == userId);
		}, me);
		
		if(socket) {
			app.nowjs.getClient(socket.clientId, function(err) {
				app.getClientController("ToDo", this.now).showOverdues(ids);
			});
		}	
    }
});
    
