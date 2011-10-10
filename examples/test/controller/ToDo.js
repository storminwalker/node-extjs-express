
Ext.define("ToDoIt.controller.ToDo", {
    extend: "ToDoIt.controller.BaseController", 
    
	models: [
		"ToDoIt.model.ToDo"
	],

	// init the routing...
    init: function(app) {
        this.callParent([app]);
        this.get("/getall", this.getAll);
    },
    
    getAll: function(req, res) {
    	console.log("controller.ToDo", "getAll");
    	
		var store = Ext.create("Ext.data.Store", {
			model: "ToDoIt.model.ToDo",
			
			proxy: {
				type: 'couch.store'
			}
		});
    	
    	function write(records, config) {
			var records  = records || [],
				config	 = config || {},
				len      = records.length,
				i        = 0,
				data     = [],
				excludes = config.excludes || [],
				deep	 = config.deep || false;
		
			for (; i < len; i++) {
				data.push(getRecordData(records[i], deep, excludes));
			}
			return data;
		}
		
		function getRecordData(record, deep, excludes) {
			var fields = record.fields,
				data = {},
				changes,
				name,
				field,
				key;
			
			fields.each(function(field){
				if(excludes.indexOf(field.name) === -1) {
					data[field.name] = record.get(field.name);
				}
			});
			
			console.log(record.getAssociatedData());
			if(deep === true) {
				Ext.apply(data, record.getAssociatedData());
			}
		
			return data;
		}
				
    	store.load({
			view: "todo/all",
			//key: ,
			callback: function() {
				res.send({
					success: true,
					total_rows: store.getTotalCount(),
					rows: write(store.getRange())
				});
			}
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


