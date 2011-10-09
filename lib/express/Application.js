
Ext.define("Ext.express.Application", {
    extend: "Ext.app.Controller",

	requires: [
        "Ext.ModelManager",
        "Ext.data.Model",
        "Ext.data.StoreManager",
        "Ext.app.EventBus"
    ],
    
    scope: undefined,

    appFolder: '.',

    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);

        var requires = config.requires || [];

        Ext.Loader.setPath(this.name, this.appFolder);

        if (this.paths) {
            Ext.Object.each(this.paths, function(key, value) {
                Ext.Loader.setPath(key, value);
            });
        }

        this.callParent(arguments);

		this.launchExpress();
		
		if(config.database) {
			Ext.Loader.setPath("Ext.database", __dirname + "../../database");
			this.launchDatabase(config.database);
		}
		
        this.eventbus = Ext.create('Ext.app.EventBus');

        var controllers = Ext.Array.from(this.controllers),
            ln = controllers && controllers.length,
            i, controller;

        this.controllers = Ext.create("Ext.util.MixedCollection");

        for (i = 0; i < ln; i++) {
            requires.push(this.getModuleClassName(controllers[i], 'controller'));
        }

        Ext.require(requires);

        for (i = 0; i < ln; i++) {
        	console.log("initializing " + controllers[i]);
			controller = this.getController(controllers[i]);
			controller.init(this);
		}
		
        this.onBeforeLaunch.call(this);
        
        this.server.listen(this.port, this.hostname);
    },

	resourcesPath: "/public",
	sharedPath: "/shared",
	viewsPath: "/views",
	viewsEngine: "ejs",
	
	port: 8000,
	hostname: null,
	environment: "development",
	
	launchDatabase: function(config) {
		var me = this;
		switch(config.type) {
			default: // currently only supporting couchdb
				Ext.require("Ext.database.Couch");
				me.database = Ext.database.Couch.init(config);
				break;
		}
	},
	
	launchExpress: function() {
		var express = require("express");
       	var app = express.createServer();
	
		if(this.configureExpress && Ext.isFunction(this.configureExpress)) {
			this.configureExpress.apply(this, express, app, this);		
		} else {
			app.use(express.logger(':method :url :status'));
			app.use(express.bodyParser());
			app.use(express.methodOverride());
			app.use(express.cookieParser());
			app.use(express.session({ secret: Guid.newGuid().toString() }));
			app.use(app.router);
	        app.use(express.static(this.appFolder + this.resourcesPath));
	        app.use(express.static(this.appFolder + this.sharedPath));
			app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
			
			if(this.viewsEngine) {
				app.set("views", this.appFolder + this.viewsPath);
				app.set("view engine", this.viewsEngine);
			}
			//default route for the index page
			app.get("/", Ext.bind(this.renderIndex, this));
			
			//app.use(this.renderError);// Ext.bind(this.renderError, this));
		}
		
		this.express = express;
		this.server = app;
	},
	
	renderIndex: function(req, res) {
		console.log("render index");
		res.render("index");
	},
	
	/*
	 function(err, req, res, next){
				res.render('500', {
					status: err.status || 500, 
					error: err
				});
			});
	*/
	renderError: function(err, req, res, next) {
	console.log("rendererror");
	
		if(err) {
			res.send("500", {
				status: err.status || 500, 
				error: err
			});
	  	}
	},
	
    control: function(selectors, listeners, controller) {
        this.eventbus.control(selectors, listeners, controller);
    },

    launch: Ext.emptyFn,

    onBeforeLaunch: function() {
       
        this.launch.call(this.scope || this);
        this.launched = true;
        this.fireEvent('launch', this);

        this.controllers.each(function(controller) {
            controller.onLaunch(this);
        }, this);
    },

    getModuleClassName: function(name, type) {
        var namespace = Ext.Loader.getPrefix(name);

        if (namespace.length > 0 && namespace !== name) {
            return name;
        }

        return this.name + '.' + type + '.' + name;
    },

    getController: function(name) {
        var controller = this.controllers.get(name);
        
        console.log(this.getModuleClassName(name, 'controller'));
        
        if (!controller) {
            controller = Ext.create(this.getModuleClassName(name, 'controller'), {
                application: this,
                id: name
            });
            
            console.log(controller.id);

            this.controllers.add(controller);
        }

        return controller;
    },

    getStore: function(name) {
        var store = Ext.StoreManager.get(name);

        if (!store) {
            store = Ext.create(this.getModuleClassName(name, 'store'), {
                storeId: name
            });
        }

        return store;
    },

    getModel: function(model) {
        model = this.getModuleClassName(model, 'model');

        return Ext.ModelManager.getModel(model);
    }
});

Ext.application = function(config) {
    Ext.require("Ext.express.Application");
	Ext.create("Ext.express.Application", config);
};
