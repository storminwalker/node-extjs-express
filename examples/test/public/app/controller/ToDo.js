
Ext.define('ToDoIt.controller.ToDo', {
    extend: 'Ext.app.Controller',
    
    stores: ['ToDos'],

    models: ['ToDo'],

    views: ['todo.Grid'],

    refs: [{
        ref: 'toDoShow',
        selector: 'todoshow'
    },{ 
    	ref: 'toDoGrid', 
    	selector: 'todogrid'
    },{
	    ref: "toDoEdit",
	    selector: "todoedit"
    }],

    init: function() {
    	this.control({
            'todogrid': {
            	viewready: function() {
            		this.getToDoGrid().getSelectionModel().select(this.getToDosStore().getAt(0));
            	},
                selectionchange: this.onGridSelection
            },
            'todogrid button[action=add]': {
                click: this.onToDoAdd
            },
            'todogrid button[action=delete]': {
                click: this.viewArticle
            }
        });
    },
    
    onGridSelection: function(sm, records) {
       	this.getToDoGrid().down('#deleteTodo').setDisabled(!records.length);
    	
		if (records[0]) {
			//this.getToDoEdit().show(true);		
			this.getToDoEdit().getForm().loadRecord(records[0]);
		}
    },
    
    onToDoAdd: function(grid) {
    	var grid = this.getToDoGrid(),
    		store = this.getToDosStore();
    		
    	grid.rowEditing.cancelEdit();
	/*
		// Create a model instance
		var r = Ext.create('Employee', {
			name: 'New Guy',
			email: 'new@sencha-test.com',
			start: new Date(),
			salary: 50000,
			active: true
		});*/

		//store.insert(0, r);
		grid.rowEditing.startEdit(0, 0);
    },
    
    onToDoDelete: function(grid) {
    	var grid = this.getToDoGrid(),
    		store = this.getToDosStore();
    		
		var sm = grid.getSelectionModel();
		grid.rowEditing.cancelEdit();
		store.remove(sm.getSelection());
		if (store.getCount() > 0) {
			sm.select(0);
		}
	}
});

