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

console.log("updating todos view");

db.save("_design/todos", {
    language: "javascript",
    views: {
    	all: {
            map: function (doc) {
	            if(doc.type && doc.type == "todo") {
            		emit(doc.user_id, doc);
            	}
            }
        },
        completed: {
			map: function (doc) {
	            if(doc.type && doc.type == "todo") {
            		emit([doc.user_id, doc.completed || false], doc);
            	}
            }	
		},
		tags: {
			map: function(doc) { 
				if(doc.type && doc.type == "todo") {
					for(var i in doc.tags) { 
						emit(doc.user_id, doc.tags[i]); 
					}
				}
			},
			reduce: function(key, values, rereduce){
				var hash = {}
				if (! rereduce) {
					for (var i in values) {
						var tag = values[i];
						hash[tag] = (hash[tag] || 0) + 1;
					}
				} else {
					for (var i in values) {
						var topN = values[i];
						for (var i in topN) {
							var pair = topN[i];
							var tag = pair[0];
							hash[tag] = (hash[tag] || 0) + pair[1];
						}
					}
				}
				var all = [];
				for (var key in hash) {
					all.push({ tag: key, count: hash[key] });
				}
				
				return all.sort(function(one, other){
					return other[1] - one[1];
				});
			}
		},
		by_tag: {
			map: function(doc) { 
				if(doc.type && doc.type == "todo") {
					for(var i in doc.tags) {
						emit([doc.user_id, doc.tags[i]], doc);
					}
				}
			}
		},
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
            }
        }
    }    
});
