
Ext.define('FV.controller.Feeds', {
    extend: 'Ext.app.Controller',

    stores: ['Feeds', 'ToDos'],
    models: ['Feed'],
    
    refs: [
        { ref: 'feedList', selector: 'feedlist'},
        { ref: 'feedData', selector: 'feedlist dataview'},
        { ref: 'todoGrid', selector: 'todogrid'},
        {
            ref: 'feedWindow', 
            selector: 'feedwindow', 
            autoCreate: true,
            xtype: 'feedwindow'
        }
    ],
    
    //requires: ['FV.lib.FeedValidator'],

    // At this point things haven't rendered yet since init gets called on controllers before the launch function
    // is executed on the Application
    init: function() {
        this.control({
            'feedlist dataview': {
                selectionchange: this.loadFeed
            },
            'feedlist button[action=add]': {
                click: this.addFeed
            },
            'feedlist button[action=remove]': {
                click: this.removeFeed
            },
            'feedwindow button[action=create]': {
                click: this.createFeed
            }
        });
    },
    
    onLaunch: function() {
    
	    if(FV.app.isLoggedIn()) {
			var dataview = this.getFeedData(),
				store = this.getFeedsStore();
				
			dataview.bindStore(store);
			dataview.getSelectionModel().select(store.getAt(0));
        }
    },
    
    loadFeed: function(selModel, selected) {
        var grid = this.getArticleGrid(),
            store = this.getArticlesStore(),
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
