
Ext.define('ToDoIt.controller.ToDo', {
    extend: 'ToDoIt.controller.BaseController',
    
    stores: ['ToDos'],

    models: ['ToDo'],

    views: ['todo.Grid'],

	now: [
		"showOverdues"
	],
	
    refs: [{ 
    	ref: 'toDoList', 
    	selector: 'todolist'
    }, { 
    	ref: 'toDoListDataView', 
    	selector: 'todolist dataview'
    }, {
        ref: 'toDoShow',
        selector: 'todoshow'
    },{ 
    	ref: 'toDoGrid', 
    	selector: 'todogrid'
    },{
	    ref: "toDoEdit",
	    selector: "todoedit"
    },{
        ref: "toDoEditForm",
	    selector: "todoedit > form"
    }],

    init: function() {
    	this.control({
            "todogrid": {
                selectionchange: this.onGridSelection
            },
            "todogrid button[action=add]": {
                click: this.onToDoAdd
            },
            "todogrid button[action=delete]": {
                click: this.onToDoDelete
            },
            "todoedit button[action=save]": {
            	click: this.onSaveToDo
            },
            "todoedit button[action=cancel]": {
            	click: this.onCancelToDo
            },
            "todogrid .checkcolumn": {
            	checkchange: function(col, index) {
           			var store = this.getToDosStore(),
	    				record = store.getAt(index),
	    				feeds = this.getToDoListDataView().getSelectionModel().getSelection();
	    
	    			if(feeds && feeds.length > 0) {
	    				if(feeds[0].get("name") == "All") {
	    					record.commit(true);
	    				} else {
 						    Ext.defer(function() { 
 						    	store.remove(record);
 						    }, 250);
	    				}
	    			}
	    
	    			this.setCompleted(record);	    
            	}
            }
        });
        
        this.getToDosStore().on("load", function() {
        	this.getToDoGrid().getSelectionModel().select(this.getToDosStore().getAt(0));
        }, this);
    },
    
    loadToDos: function(filter, id) {
		var grid = this.getToDoGrid(),
			store = this.getToDosStore();
        	    
    	this.currentFilter = filter;
    	
    	store.load({
        	params: this.currentFilter,
        	callback: function() {        	
	        	grid.getSelectionModel().select(store[(id) ? "getById" : "getAt"](id || 0));
        	},
        	scope: this
        });
    },
    
    showOverdues: function() {
    	Ext.Msg.alert("asdasdsdad");
    },
    
    onGridSelection: function(sm, records) {
       	this.getToDoGrid().down('#deleteTodo').setDisabled(!records.length);
    	
		if (records[0]) {
			this.getToDoEdit().expand(true);		
			this.getToDoEdit().getForm().loadRecord(records[0]);
			
			this.getToDoEdit().down(".textfield[name=name]").focus();
		}
    },
    
    onToDoAdd: function(grid) {
    	var grid = this.getToDoGrid(),
    		store = this.getToDosStore();
    		
		// Create a model instance
		var r = Ext.create("ToDoIt.model.ToDo", {
			createdDate: new Date(),
			dueOn: new Date(),
			priority: 5,
			status: "Open"
		});

		store.add(r);
		grid.getSelectionModel().select(store.getAt(store.data.length - 1));
    },
    
    onToDoDelete: function(grid) {
    	var grid = this.getToDoGrid(),
    		store = this.getToDosStore();
    		
		var sm = grid.getSelectionModel();
		store.remove(sm.getSelection());
		if (store.getCount() > 0) {
			sm.select(0);
		}
	},
	
	onSaveToDo: function() {		
		var edit = this.getToDoEdit(),
			record = edit.getRecord();
	
		if(record) {
			edit.getForm().updateRecord(record);	
			record.save({
				success: function() {
					this.loadToDos(this.currentFilter, record.getId());
				},
				scope: this
			});
		}
	},
	
	onCancelToDo: function() {
		var grid = this.getToDoGrid(),
    		store = this.getToDosStore(),
    		edit = this.getToDoEdit(),
    		sm = grid.getSelectionModel();
    		
    	var record = edit.getRecord();
    	if(record.phantom === true) {
    		store.remove(record);
    		
    		if (store.getCount() > 0) {
				sm.select(0);
			}
    	} else {
    		sm.select(record);
    	}
	},
	
    setCompleted: function(records) {
		if(! Ext.isArray(records)) {
			records = [records];
		}
	
		var postData = [];
		
		Ext.each(records, function(record) {
		    postData.push({
		    	id: record.getId(),
		    	completed: record.get("completed")
		    }); 			
		});

	    ToDoIt.util.Ajax.post({
			url: "/todo/complete",
			jsonData: postData,
			success: function(response) {
				console.log(response);
			},
			failure: function(response, opts) {
				console.log(response);
			},
			scope: this
		});
    }
});

