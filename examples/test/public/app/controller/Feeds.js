
Ext.define('ToDoIt.controller.Feeds', {
    extend: 'Ext.app.Controller',

    stores: ['Feeds', 'ToDos'],
    
    models: ['Feed'],
    
    refs: [
        { ref: 'toDoList', selector: 'todolist'},        
        { ref: 'toDoListDataView', selector: 'todolist dataview'},
        { ref: 'toDoShow', selector: 'todoshow'},
        { ref: 'toDoGrid', selector: 'todogrid'}
    ],
    
    // At this point things haven't rendered yet since init gets called on controllers before the launch function
    // is executed on the Application
    init: function() {
        this.control({
            'todolist dataview': {
                selectionchange: this.loadToDos
            }
        });
    },
    
    onLaunch: function() {
    	this.callParent(arguments);
    	
        if(ToDoIt.app.isLoggedIn()) {
        	var dataview = this.getToDoListDataView(),
				store = this.getFeedsStore(),
				sm = dataview.getSelectionModel();
				
			dataview.bindStore(store);
			
			sm.deselectAll(true);
			sm.select(store.getAt(0));
        }
    },
    
    loadToDos: function(selModel, selected) {
    console.log("selected!");
        var feed = selected[0];

        if (feed) {
            this.getToDoShow().setTitle(feed.get("description"));
        	this.application.getController("ToDo").loadToDos(feed.get("params"));    
        }
    }
});
