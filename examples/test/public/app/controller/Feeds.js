
Ext.define('ToDoIt.controller.Feeds', {
    extend: 'Ext.app.Controller',

    stores: ['Feeds', 'ToDos'],
    
    models: ['Feed'],
    
    refs: [
        { ref: 'toDoList', selector: 'todolist'},
        { ref: 'toDoListDataView', selector: 'todolist dataview'},
        { ref: 'toDoGrid', selector: 'todogrid'}
    ],
    
    // At this point things haven't rendered yet since init gets called on controllers before the launch function
    // is executed on the Application
    init: function() {
        this.control({
            'feedlist dataview': {
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
        var grid = this.getTodoGrid(),
            store = this.getToDosStore(),
            feed = selected[0];

        if (feed) {
            this.getFeedShow().setTitle(feed.get('name'));
            grid.enable();
            store.load({
                params: {
                    feed: feed.get('url')
                }
            });            
        }
    }
});
