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

function create_database(dbname) {
    var db = connection.database(dbname);
    db.exists(function(err, exists) {
        if (!exists) {
            db.create()
        }
    });
    return db;
}

var todoit = create_database('todoit')

function cradle_error(err, res) {
    if (err) { 
    	console.log(err)
    }
}

function update_views(db, docpath, code) {
    function save_doc() {
        db.save(docpath, code, cradle_error);
        return true;
    }
    // compare function definitions in document and in code
    function compare_def(docdef, codedef) {
        var i = 0;
        if (!codedef && !docdef) {
            return false;
        }
        if ((!docdef && codedef) || (!codedef && docdef)) {
            console.log('new definitions - updating "' + docpath +'"')
            return true;
        }        
        for (var u in docdef) {
            i++;
            if (!codedef[u] || docdef[u] != codedef[u].toString()) {
                console.log('definition of "' + u + '" changed - updating "' + docpath +'"')
                return true;
            }
        }
        // check that both doc and code have same number of functions
        for (var u in codedef) {
            i--;
            if (i < 0) {
                console.log('new definitions - updating "' + docpath +'"')
                return true;
            }
        }
        return false;
    }
    
    db.get(docpath, function(err, doc) {
        if (!doc) {
            console.log('no design doc found updating "' + docpath +'"')
            return save_doc();
        }
        if (compare_def(doc.updates, code.updates) || compare_def(doc.views, code.views)) {
            return save_doc();
        }
        console.log('"' + docpath +'" up to date')            
    });
}

var todo_designdoc = {
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
}


var users_designdoc = {
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
}

update_views(todoit, '_design/todo', todo_designdoc);
update_views(todoit, '_design/users', users_designdoc);
