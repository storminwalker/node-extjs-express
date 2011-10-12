
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
        if(ToDoIt.app.isLoggedIn()) {
			var dataview = this.getToDoListDataView(),
				store = this.getFeedsStore();
				
			dataview.bindStore(store);
			dataview.getSelectionModel().select(store.getAt(0));
        }
    },
    
    loadToDos: function(selModel, selected) {
        var grid = this.getToDoGrid(),
            store = this.getToDosStore(),
            feed = selected[0];

        if (feed) {
            this.getToDoShow().setTitle(feed.get("description"));
            grid.enable();
            store.load({
                params: feed.get("params")
            });            
        }
    }
});
