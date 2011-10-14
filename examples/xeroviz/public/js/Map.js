
Ext.define("XERO.viz.Map", {
	extend: "Ext.ux.GMapPanel",
	alias: "widget.vizmap",
	
	socket: null,
	
	initComponent: function(config) {
		
		this.callParent(arguments);
		
		this.socket.on({
			location: function(cmp, msg) {
				if(msg && msg.location) {
					this.placeMarker(msg.location);
				}
			},
			scope: this
		});
	},
	
	removeMarker: function(marker) {
    	marker.setMap(null);
    },
    
    
    placeMarker: function(location) {
    	console.log(location);
    	
     	var marker = this.addMarker(new google.maps.LatLng(location.latitude, location.longitude), {
	     	title : location.city || location.country_name
     	});
     	/*
     	
    	var marker = new google.maps.Marker({ 
			map: this.getMap(), 
			title : location.city || location.country_name,
			position: new google.maps.LatLng(location.latitude, location.longitude)  
		});
		*/
		Ext.defer(function() {
			this.removeMarker(marker);
		}, 2000, this);
		
	}
});
