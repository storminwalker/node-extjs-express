var cradle = require("cradle");

cradle.setup({ 
	host: 'localhost',
    port: 5984,
    options: { 
		cache: false, 
		raw: false 
	}
});

var connection = new (cradle.Connection);
var db = connection.database("todoit");

console.log("updating todo view");

db.save("_design/todo", {
    language: "javascript",
    views: {
    	tags: {
			map: function(doc) { 
				if(doc.type && doc.type == "todo") {
					for(var i in doc.tags) { 
						emit([doc.user_id, doc.tags[i]], 1); 
					}
				}
			},
			reduce: function(tag, counts) { 
				return sum(counts);
			}
		},
		by_tag: {
			map: function(doc) { 
				if(doc.type && doc.type == "todo") {
					for(var tag in doc.Tags) {
						emit([doc.user_id, tag], doc);
					}
				}
			}
		},
		completed: {
			map: function (doc) {
	            if(doc.type && doc.type == "todo") {
            		emit([doc.user_id, doc.completed || false], doc);
            	}
            },
            reduce: function(keys, counts, rereduce) {
                return sum(counts);
            }		
		},
        all: {
            map: function (doc) {
	            if(doc.type && doc.type == "todo") {
            		emit([doc.user_id, doc._id], doc);
            	}
            },
            reduce: function(keys, counts, rereduce) {
                return sum(counts);
            }
        }
    }    
});

console.log("updating users view");

db.save("_design/users", {
    language: "javascript",
    views: {
    	by_username: {
			map: function (doc) {
	            if(doc.type && doc.type == "user") {
            		emit(doc.userName, doc);
            	}
            },
		},
		all: {
            map: function (doc) {
	            if(doc.type && doc.type == "user") {
            		emit(doc._id, doc);
            	}
            },
            reduce: function(keys, counts, rereduce) {
                return sum(counts);
            }
        }
    }    
});
