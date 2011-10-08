
require("node-extjs");

function _hash(msg, key) {
	return require("crypto").createHmac("sha256", key).update(msg).digest('hex');
}

Ext.Loader.setPath("Ext.database", __dirname);
Ext.require("Ext.database.Couch");

Ext.database.Couch.init({
	type: "relax",
	name: "todoit",
	host: "localhost",
	port: 5984,
	options: { 
		cache: true, 
		raw: false 
	}
});


Ext.apply(Ext.data.validations, {

	custom: function(config, value, callback) {
		return (config.handler) ? config.handler.call(config.scope || this, config, value, callback) : true;
	}

});

Ext.override(Ext.data.Model, {
    
	validate: function(callback) {
        var errors      = new Ext.data.Errors(),
            validations = (type && this.validations[type]) ? this.validations[type] : this.validations,
            validators  = Ext.data.validations,
            length, validation, field, association, valid, type, i;

        if (validations) {
            length = validations.length;
			var waiting = length;

			function complete() {
				if (!waiting) {
				   callback((errors.getCount() === 0), errors);
				}
			}

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                associationName = validation.association;

				if(type === "custom") {
					validation["scope"] = this;
					validators[type](validation, this.get(field), function(valid) {
						if(! valid) {
							errors.add({
								field  : field,
								message: validation.message || validators[type + 'Message'],
								scope: this
							});
                        }
						waiting--;
						complete();
					});
				} else {
					valid = validators[type](validation, this.get(field));
                    if (!valid) {
                        errors.add({
                            field  : field,
                            message: validation.message || validators[type + 'Message'],
                            scope: this
                        });
                    }
                    waiting--;
					complete();
				}
            }
        }
    }
    
    /*
    validate: function(deep, type) {
        var errors      = new Ext.data.Errors(),
            validations = (type && this.validations[type]) ? this.validations[type] : this.validations,
            validators  = Ext.data.validations,
            length, validation, field, association, valid, type, i;

        if (validations) {
            length = validations.length;

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                associationName = validation.association;

				if(type === "custom") {
					validation["scope"] = this;
				}
				
                if (type && (type === "custom" || field)) {
                    valid = validators[type](validation, this.get(field));
                    if (!valid) {
                        errors.add({
                            field  : field,
                            message: validation.message || validators[type + 'Message'],
                            scope: this
                        });
                    }
                } else if (deep && associationName && this.associations.map[associationName]) {
                    this[associationName]().each(function (record) {
                        var errs = record.validate(deep, type);
                        if (!errs.isValid()) {
                            errors.addAll(errs.items);
                        }
                    });
                }
            }
        }

        return errors;
    },
    
    isValid: function(deep, type) {
    	var errors = this.validate(deep, type);
    	return (errors.getCount() == 0);
    }*/
});


Ext.define("SharedUser", {
    extend: "Ext.data.Model",
    
    idProperty: "_id",
    
    fields: [
    	{ name: "_id", type: "string", persist: false },
        { name: "_rev", type: "string", persist: false },
        { name: "firstName",     type: "string" },
        { name: "lastName",     type: "string" },
        { name: "email",     type: "string" },
        { name: "userName", type: "string" },
        { name: "password", type: "string" }
    ],
    
    getFullName: function() {
    	return String.format("{0} {1}", this.get("firstName"), this.get("lastName"));
    },

	validations: [
    	{ type: "format", field: "userName", matcher: /([a-z]+)[0-9]{2,3}/ }
    ]
});

Ext.define("User", {
    extend: "SharedUser",
    
    fields: [
        { name: "salt", type: "string" }
    ],
    
    getFullName: function() {
    	return String.format("{0} {1}", this.get("firstName"), this.get("lastName"));
    },

    generatePasswordHash: function() {
    	this.set("salt", Guid.newGuid().toString());
    	this.set("password", _hash(this.get("password"), this.get("salt")));
    },
    
	validations: [{
   		type: "custom", 
		handler: function(config, value, callback) { 
		console.log(this.get("userName"));
			Ext.database.Couch.instance.view("users/by_username", { key: this.get("userName") }, function (err, doc) {
			console.log(doc);
				callback((doc.total_count === 0));
			});
		},
		message: "Username must be unique"
    }],
    
    proxy: {
        type: 'couch.model'
	}
});


var store = Ext.create("Ext.data.Store", {
    model: "User",
    
    proxy: {
        type: 'couch.store'
	}
});

var user = Ext.create('User', {
	firstName: "Catherine", 
	lastName: "Walker",
	email: "craig.walker@me.com",
	userName: "catherinewalker",
	password: "Password123"
});

user.validate(function(valid, errors) {
	if(valid) {
		user.generatePasswordHash();
	
		user.save({
			success: function() {
				console.log(arguments);
			}
		});
	} else {
		console.log(errors);
	}
});

console.log("ASYNC BITCH!");

/*

var user = Ext.create('User', {
	firstName: "Catherine", 
	lastName: "Walker",
	email: "craig.walker@me.com",
	password: "Password123"
});

user.generatePasswordHash();


*/


/*
var writer = user.getProxy().getWriter();

Ext.database.Couch.instance.save(writer.getRecordData(user), function (err, res) {
	console.log(err);
	console.log(res);
});
*/
//user.save();
/*
Ext.database.Couch.loadModelByView("User", "users/by_username", "craigwalker", {
	success: function(user) {
		console.log(user.getFullName());
	}
});

User.load("c65fe7bc9348e5e37627643509000ccc", {
	success: function(user) {
		console.log(user.getFullName());
	}
});

store.load({
	view: "users/all",
	callback: function() {
		store.each(function(doc) {
			console.log(doc.getPasswordHash());
		});
	}
});*/
