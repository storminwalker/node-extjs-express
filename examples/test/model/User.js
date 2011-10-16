
var crypto = require("crypto");

function _hash(msg, key) {
	return crypto.createHmac("sha256", key).update(msg).digest('hex');
}

Ext.define("ToDoIt.model.User", {

	extend: "ToDoIt.shared.model.User",

	fields: [
		{ name: "type", type: "string" },
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
		console.log("custom", this.get("userName"));
			Ext.database.Couch.instance.view("users/by_username", { key: this.get("userName") }, function (err, doc) {
				callback((doc.rows.length === 0));
			});
		},
		message: "Username must be unique"
    }],
    
	statics: {
		login: function(username, password, callback) {
			console.log("model.login:", username, password);
			
			Ext.database.Couch.loadModelByView("ToDoIt.model.User", "users/by_username", username, {
				success: function(user) {
					if(! user) {
						return callback(new Error("cannot find user"));					
					}
				
					if (user.get("password") == _hash(password, user.get("salt"))) { 
						return callback(null, user);
					}
			
					callback(new Error("invalid password"));
				},
				failure: function() {
					return callback(new Error("cannot find user"));	
				}
			});
		}
	},
	
	proxy: {
        type: "couch.model"
	}
});
