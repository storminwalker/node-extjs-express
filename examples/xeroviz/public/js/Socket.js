
Ext.define("XERO.viz.Socket", {
    
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    constructor: function(config) {
        config = config || {};
        
        this.mixins.observable.constructor.call(this, config);
        
        this.state = "stopped";
        this.host = this.host || document.location.hostname;
		this.port = this.port || 8000;
	},
    
	onClose: function() {
		if(this.getState() == "paused") {
			return;
		}
		if(this.getState() == "retrying") {
		  	console.log("still no socket, retrying in 3 seconds");
		  	Ext.defer(this.start, this, 3000);
		} else {
		  	this.setState("retrying");
		  	console.log("socket lost, retrying immediately");
		  	Ext.defer(this.start, this, 500);
		}
	},

	onOpen: function() {
		this.setState("started");
		console.log(Ext.util.Format.format("socket {0} listening on {1} started", this.host, this.port));
	},
	
	onMessage: function(message) {
		this.fireEvent(message.type || "message", this, message);
	},
	
	getState: function() {
		return this.state;
	},
	
	setState: function(state) {
		this.state = state;
	},

	start: function() {
		this.socket = io.connect(this.host, { 
			port: this.port
		});

		this.socket.on("message", Ext.bind(this.onMessage, this));
		this.socket.on("disconnect", Ext.bind(this.onClose, this));
		this.socket.on("connect", Ext.bind(this.onOpen, this));
	}
});
