
var	geoip = require("geoip"),
	path = require("path");

Ext.define("XERO.controller.Viz", {
    extend: "Ext.app.Controller",

	hitCount: 0,
	
	// init the routing...
    init: function(app) {
		this.initGeoLookup();
        
        app.server.get('/*', Ext.bind(this.serveTrackingGif, this));
    },
    
    onLaunch: function() {
        var task = {
			run: this.broadcastHits,
			scope: this,
			interval: 5000 //5 seconds
		};
		
		this.application.io.sockets.on("connection", function(client){
			console.log("new client - starting task");
			// start the task runner
			Ext.TaskManager.start(task);
			
			client.on('disconnect', function(){ 
				console.log("lost client - stopping task"); 
				// stop the task runner - only collect hits when a connection is live
				Ext.TaskManager.stop(task);
			})
		});
    },
    
    initGeoLookup: function() {
		var cityPath = path.normalize(__dirname + '/../geoip/GeoLiteCity.dat');
		try {
			this.cityDb = new geoip.City(cityPath);
			console.log("GEOIP database initialized");
		} catch(err) {
			console.log("Cannot init GEOIP database");
		}
	},
    
    serveTrackingGif: function(req, res, next) {
    	next();

		var qs = Ext.Object.fromQueryString(req.url);
		qs.ip = qs.ip || request.headers["x-forwarded-for"] || request.connection.remoteAddress;
		
	    this.broadcastLocation({
	    	ip: qs.ip
	    });
	    this.hitCount++;
	},

	broadcastLocation: function(data) {
		var remoteAddress;
      		
		if(data.ip == "127.0.0.1") {
			remoteAddress = "8.8.8.8";
		} else {
			remoteAddress = data.ip;
		}
		
		Ext.apply(data, {
			type: "location",
			timestamp: new Date(),
			location: this.cityDb.lookupSync(remoteAddress)
		});
		
		if(data.location.latitude) {
			this.application.io.sockets.emit("message", data);
		}	
	},
	
	broadcastHits: function() {
		this.application.io.sockets.emit("message", {
			type: "hits",
			timestamp: new Date(),
			hits: this.hitCount
		});
		this.hitCount = 0;
	}
})
    
