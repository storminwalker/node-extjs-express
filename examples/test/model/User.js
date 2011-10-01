
var crypto = require("crypto");

/*
function hash(msg, key) {
	return crypto.createHmac("sha256", key).update(msg).digest('hex');
}
var userDb = new Ext.util.MixedCollection();

userDb.add("craigwalker",  {
	_id: "1",
	name: 'Craig Walker',
	username: "craigwalker",
	salt: 'randomly-generated-salt',
	password: hash('p', 'salt')
});
userDb.add("catherine",  {
	_id: "2",
	name: 'Catherine Walkerston ',
	username: "catherine",
	salt: 'randomly-generated-salt',
	password: hash('Password123', 'salt')
});

*/
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
				if (user.password == MyApp.model.User._hash(password, user.salt)) { 
					return callback(null, user);
				}
			
				callback(new Error('invalid password'));
			});
		},
		
		getAll: function(callback) {
			return callback(userDb.getRange());
		},
		
		_hash: function(msg, key) {
			return crypto.createHmac("sha256", key).update(msg).digest('hex');
		}
	}
});
