
var crypto = require("crypto");

function _hash(msg, key) {
	return crypto.createHmac("sha256", key).update(msg).digest('hex');
}

Ext.define("MyApp.model.User", {

	extend: "MyApp.shared.model.User",

	statics: {
		login: function(username, password, callback) {
			console.log("model.login:", username, password);
			
			if(Ext.isEmpty(username)) {
				return callback(new Error('username must be provided'));
			}
			
			Ext.database.Couch.instance.view("users/byUserName", { key: username }, function(err, users) {
				console.log(users);
				if (! users || users.length === 0) {
					return callback(new Error('cannot find user'));
				}
				
				var user = users[0].value;
				
				console.log(user);
				if (user.password == _hash(password, user.salt)) { 
					return callback(null, user);
				}
			
				callback(new Error('invalid password'));
			});
		},
		
		getAll: function(callback) {
			return callback(userDb.getRange());
		}
	}
});
