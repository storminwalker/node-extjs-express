
Ext.define('ToDoIt.controller.ToDo', {
    extend: 'Ext.app.Controller',
    
    stores: ['ToDos'],

    models: ['ToDo'],

    views: ['todo.Grid'],

    refs: [{
        ref: 'toDoShow',
        selector: 'todoshow'
    }],

    init: function() {
    
    
    ,
				handler : function() {
					rowEditing.cancelEdit();
	
					// Create a model instance
					var r = Ext.create('Employee', {
						name: 'New Guy',
						email: 'new@sencha-test.com',
						start: new Date(),
						salary: 50000,
						active: true
					});
	
					store.insert(0, r);
					rowEditing.startEdit(0, 0);
				}
/*        this.control({
        	
            'articlegrid': {
                selectionchange: this.previewArticle
            },
            'articlegrid > tableview': {
                itemdblclick: this.loadArticle,
                refresh: this.selectArticle
            },
            'articlegrid button[action=openall]': {
                click: this.openAllArticles
            },
            'articlepreview button[action=viewintab]': {
                click: this.viewArticle
            },
            'articlepreview button[action=gotopost]': {
                click: this.openArticle
            }
        });*/
    }
});

