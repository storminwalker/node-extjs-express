
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
		cache: false, 
		raw: false 
	}
});

Ext.define("SharedUser", {
    extend: "Ext.data.Model",
    
    idProperty: "_id",
    
    fields: [
    	{ name: "_id", type: "string", persist: false },
        { name: "_rev", type: "string", persist: false },
        { name: "type", type: "string" },
        { name: "firstName", type: "string" },
        { name: "lastName", type: "string" },
        { name: "email", type: "string" },
        { name: "userName", type: "string" },
        { name: "password", type: "string" }
    ],
    
    getFullName: function() {
    	return String.format("{0} {1}", this.get("firstName"), this.get("lastName"));
    },

	validations: [
    	{ type: "presence", field: "userName" },
    	{ type: "presence", field: "firstName" },
    	{ type: "presence", field: "lastName" }
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
				callback((doc.rows.length === 0));
			});
		},
		message: "Username must be unique"
    }],
    
    //proxy: {
    //    type: 'couch.model'
	//}
});


Ext.define("SharedToDo", {
    extend: 'Ext.data.Model',
    
    idProperty: "_id",
    
    fields: [
    	{ name: "_id", type: 'string' },
        { name: "_rev", type: 'string' },
        { name: "name", type: 'string'},
        { name: "createdOn", type: 'date'},
        { name: "dueOn", type: 'date'},
        { name: "notes", type: 'string'},
        { name: "priority", type: 'int'},
        { name: "completed", type: 'boolean'},
        { name: "completedOn", type: 'date'},
        { name: "status", type: "string" },
        { name: "tags" }
    ],

	validations: [
        { type: "presence", field: "name" },
		{ type: "presence", field: "dueOn" },		
        { type: "length", field: "name", max: 100}
    ]
});

Ext.define("ToDo", {

	extend: "SharedToDo",

	//proxy: {
    //    type: "couch.model"
	//}
});


var store1 = Ext.create("Ext.data.Store", {
    model: "User",
    
    proxy: {
        type: 'couch.store'
	}
});

var store2 = Ext.create("Ext.data.Store", {
    model: "ToDo",
    
    proxy: {
        type: 'couch.store'
	}
});

store1.load({
	view: "users/by_username",
	callback: function() {
		store1.each(function(doc) {
			console.log(doc.data);
		});
	}
});
/*
store2.load({
	view: "todos/completed",
	key: [ "c65fe7bc9348e5e37627643509000ccc", false ],
	callback: function() {
		store2.each(function(doc) {
			console.log(doc.data);
		});
	}
});
*/
/*
Ext.database.Couch.instance.view("todos/all", { key: "c65fe7bc9348e5e37627643509000ccc" },
	function(err, docs) {
		console.log(docs);
	}
);

Ext.database.Couch.instance.view("todos/completed", { key: [ "c65fe7bc9348e5e37627643509000ccc", false ] },
	function(err, docs) {
	console.log("COMPLETED!");
	console.log(docs);
	}
);


Ext.database.Couch.instance.view("todos/by_tag", { key: ["c65fe7bc9348e5e37627643509000ccc", "test"] },
	function(err, docs) {
	
	
		console.log(docs);
	}
);

Ext.database.Couch.instance.view("todos/tags", { key: "c65fe7bc9348e5e37627643509000ccc", reduce: true },
	function(err, docs) {
		docs.forEach(function(doc) {
			console.log(doc);
		});
	}
);*/

/*
var proxy1 = new Ext.database.proxy.CouchStore({
	model: "User"
});

var proxy2 = new Ext.database.proxy.CouchStore({
	model: "ToDo"
});


Ext.database.Couch.instance.view("todo/all",
	function(err, docs) {
		console.log(docs);
	}
);
Ext.database.Couch.instance.view("users/by_username",
	function(err, docs) {
		console.log(docs);
	}
);*/
console.log("ASYNC");

/*
var user = Ext.create('User', {
	type: "user",
	firstName: "Craig", 
	lastName: "Walker",
	email: "craig.walker@me.com",
	userName: "craigwalker2",
	password: "p"
});

user.validate(function(valid, errors) {
	if(valid) {
		user.generatePasswordHash();
	
		user.save({
			success: function() {
				console.log(user);
				
				user.set("email", "craig@xero.com");
				user.save({
					success: function() {
						console.log(user);
					}
				});
			}
		});
	} else {
		console.log(errors);
	}
});

Ext.database.Couch.loadModelByView("User", "users/by_username", "craigwalker", {
	success: function(user) {
		console.log(user.data);
	}
});
*/
//console.log("ASYNC BITCH!");

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
*/


