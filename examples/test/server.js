
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs-express");

require("node-extjs-express");

new Ext.express.Application({
	name: "ToDoIt",
	appFolder: __dirname,
	
	paths: {
		"ToDoIt.shared.model": __dirname + "/public/app/shared/model"
	},
	
	controllers: [
		"User",
		"ToDo",
		"Daemon"
	],
	
	database: {
		type: "relax",
		name: "todoit",
		host: "localhost",
		port: 5984,
		options: { 
			cache: false, 
			raw: false 
		}
	},
	
  	launch: function() {
  		console.log("ToDoIt launched");
  	
  		this.launchNow();
  	},
  	
  	launchNow: function() {
  		var me = this;
  		me.connectedUsers = Ext.create("Ext.util.MixedCollection");
		
  		var	nowjs = require("now"),
			everyone = nowjs.initialize(me.server);
			
		me.now = everyone.now,
		me.nowjs = nowjs;
		
	    var parseCookie = require("connect").utils.parseCookie;
 
		nowjs.server.set("authorization", function (data, accept) {
			if (data.headers.cookie) {
				data.cookie = parseCookie(data.headers.cookie);
				data.sessionID = data.cookie[me.sessionConfig.key];
			} else {
			   return accept("No cookie transmitted.", false);
			}
			accept(null, true);
		});
	    
		nowjs.server.sockets.on('connection', function (socket) {
			if(me.connectedUsers.containsKey(socket.handshake.sessionID)) {
				me.connectedUsers.removeAtKey(socket.handshake.sessionID);
			}
			
			me.connectedUsers.add(socket.handshake.sessionID, {
				clientId: socket.id,
				sessionId: socket.handshake.sessionID,
				userId: null
			});
			
			console.log('SessionID ' + socket.handshake.sessionID + ' on ' + 
				socket.id + ' connected!');
		});

		nowjs.on("connect", function() {
			console.log("now connected: " + this.user.clientId);
			
			me.connectedUsers.each(function(item) {
				console.log(item);
			}, this);
		});	    
		
	    nowjs.on("disconnect", function() {
			console.log("now disconnected: " + this.user.clientId);
			var idx = me.connectedUsers.findIndexBy(function(client) {
				return (client.clientId = this.user.clientId);
			}, this);
			if(idx && idx != -1) {
				me.connectedUsers.removeAt(idx);
			}
		});	    
		
	},
	
	getClientController: function(name, now) {
		return (now) ? now[name + "Client"] : this.now[name + "Client"];
	}
});
