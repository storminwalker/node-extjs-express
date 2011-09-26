
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

/*
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
*/
        this.onBeforeLaunch.call(this);
    },

	loadControllers: function() {
	
	
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
