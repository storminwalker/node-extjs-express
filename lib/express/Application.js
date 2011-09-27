
Ext.define('Ext.express.Application', {
    extend: 'Ext.app.Controller',

	requires: [
        'Ext.ModelManager',
        'Ext.data.Model',
        'Ext.data.StoreManager',
        'Ext.app.EventBus'
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

        this.eventbus = Ext.create('Ext.app.EventBus');

        var controllers = Ext.Array.from(this.controllers),
            ln = controllers && controllers.length,
            i, controller;

        this.controllers = Ext.create('Ext.util.MixedCollection');

        for (i = 0; i < ln; i++) {
            requires.push(this.getModuleClassName(controllers[i], 'controller'));
        }

        Ext.require(requires);

        for (i = 0; i < ln; i++) {
			controller = this.getController(controllers[i]);
			controller.init(this);
		}

		this.bootExpress();
		
        this.onBeforeLaunch.call(this);
    },

	resourcesPath: "/public",
	port: 8000,
	hostname: null,
	environment: "development",
	
	bootExpress: function() {
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
			app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		}
		
		this.express = express;
		this.server = app;
		
		this.server.listen(this.port, this.hostname);
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

        if (!controller) {
            controller = Ext.create(this.getModuleClassName(name, 'controller'), {
                application: this,
                id: name
            });

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
