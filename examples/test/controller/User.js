

Ext.define('MyApp.controller.User', {
    extend: 'Ext.app.Controller',

	// init the routing...
    init: function(app) {
        
    },
    
    // /users
    index: function(req, res) {
    	res.render({ userId: "124567890" });
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
});
