
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

