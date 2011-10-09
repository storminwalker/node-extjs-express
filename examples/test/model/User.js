
var crypto = require("crypto");

function _hash(msg, key) {
	return crypto.createHmac("sha256", key).update(msg).digest('hex');
}

Ext.define("ToDoIt.model.User", {

	extend: "ToDoIt.shared.model.User",

	statics: {
		login: function(username, password, callback) {
			console.log("model.login:", username, password);
			
			Ext.database.Couch.loadModelByView("User", "users/by_username", username, {
				success: function(user) {
					console.log(user);
					if(! user) {
						return callback(new Error("cannot find user"));					
					}
				
					console.log(user.data);
					if (user.get("password") == _hash(password, user.get("salt"))) { 
						return callback(null, user);
					}
			
					callback(new Error("invalid password"));
				},
				failure: function() {
					console.log("login failure!");
				}
			});
		}
	},
	
	proxy: {
        type: "couch.model"
	}
});
