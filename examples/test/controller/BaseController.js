
function write(records, config) {
	var records  = records || [],
		config	 = config || {},
		len      = records.length,
		i        = 0,
		data     = [],
		excludes = config.excludes || [],
		deep	 = config.deep || false;

	for (; i < len; i++) {
		data.push(getRecordData(records[i], deep, excludes));
	}
	return data;
};

function getRecordData(record, deep, excludes) {
	var fields = record.fields,
		data = {},
		changes,
		name,
		field,
		key;
	
	fields.each(function(field){
		if(excludes.indexOf(field.name) === -1) {
			data[field.name] = record.get(field.name);
		}
	});
	
	if(deep === true) {
		Ext.apply(data, record.getAssociatedData());
	}

	return data;
}

Ext.define("ToDoIt.controller.BaseController", {
    extend: "Ext.app.Controller",

	baseUrl: "",
	now: [],
	
	// init the routing...
    init: function(app) {
        console.log("base");
    },
    
    onLaunch: function() {
    	this.launchNow();	
    },
    
  	launchNow: function() {
		var slice = Array.prototype.slice,
			me = this,
			app = me.application,
			methods = Ext.Array.from(this.now),
            ln = methods && methods.length,
            i, 
            method;

		if(ln > 0 && this.id) {
			var obj = {};
			for (i = 0; i < ln; i++) {
				obj[methods[i]] = this[methods[i]];
			}
			
			app.now[this.id + "Server"] = obj;	
		}
		/*
		everyone.now.getServerController = function(name, action){
			var args = slice.call(arguments);
			me.getController(name)[action].apply(me, args.slice(2));
		}
		*/
	},
	
	
    authenticate: function(req, res, next) {
    	console.log("controller.BaseController", "authenticate");
    	
		if (req.session && req.session.user) {
			next();
		} else {
			res.send(401, {
				authenticated: false
			});
		}
    },
    
    buildUrl: function(path) {
    	return this.baseUrl + path;
    },
    
    get: function(route, callback) {
    	this.application.server.get(this.buildUrl(route), Ext.bind(this.authenticate, this), Ext.bind(callback, this));
    },
    
    post: function(route, callback) {
    	this.application.server.post(this.buildUrl(route), Ext.bind(this.authenticate, this), Ext.bind(callback, this));
    },
    
    del: function(route, callback) {
    	this.application.server.del(this.buildUrl(route), Ext.bind(this.authenticate, this), Ext.bind(callback, this));
    },
    
    put: function(route, callback) {
    	this.application.server.put(this.buildUrl(route), Ext.bind(this.authenticate, this), Ext.bind(callback, this));
    },
    
    rest: function() {
    	this.application.server.get(this.buildUrl("/:id"),
			Ext.bind(this.authenticate, this), 
			Ext.bind(this.loadById, this),
			Ext.bind(this.read, this)); 
    	
    	this.application.server.post(this.buildUrl(""),
			Ext.bind(this.authenticate, this), 
			Ext.bind(this.create, this)); 
			
		this.application.server.put(this.buildUrl("/:id"),
			Ext.bind(this.authenticate, this), 
			Ext.bind(this.loadById, this),
			Ext.bind(this.update, this)); 

		this.application.server.del(this.buildUrl("/:id"),
			Ext.bind(this.authenticate, this), 
			Ext.bind(this.loadById, this),
			Ext.bind(this.destroy, this)); 
    },
    
    sendStore: function(res, store, config) {
		res.send({ 
    		success: true,
			total_rows: store.getTotalCount(),
			rows: write(store.getRange(), config)
		});
    },
    
    sendModel: function(res, record, config) {
		res.send({ 
    		success: true,
			total_rows: 1,
			rows: write([record], config)
		});
    }
    
    /*
    
    login: function(req, res, next) {
	    var user = users[name];
		if (!user) return fn(new Error('cannot find user'));
		if (user.pass == hash(pass, user.salt)) return fn(null, user);
		fn(new Error('invalid password'));
    }
    
    function loadUser(req, res, next) {
  // You would fetch your user from the db
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

function andRestrictToSelf(req, res, next) {
  // If our authenticated user is the user we are viewing
  // then everything is fine :)
  if (req.authenticatedUser.id == req.user.id) {
    next();
  } else {
    // You may want to implement specific exceptions
    // such as UnauthorizedError or similar so that you
    // can handle these can be special-cased in an error handler
    // (view ./examples/pages for this)
    next(new Error('Unauthorized'));
  }
}

function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.authenticatedUser.role == role) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  }
    */
});
