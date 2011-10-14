
Ext.define("XERO.viz.Chart", {
	extend: "Ext.chart.Chart",
	alias: "widget.vizchart",
	
	socket: null,
	
	initComponent: function() {
		
		Ext.apply(this, {
			style: 'background:#fff',
            store: this.buildStore(),
            shadow: false,
            animate: false,
            axes: [{
                type: 'Numeric',
                grid: true,
                minimum: 0,
                maximum: 100,
                position: 'left',
                fields: ['hits'],
                grid: {
                    odd: {
                        fill: '#dedede',
                        stroke: '#ddd',
                        'stroke-width': 0.5
                    }
                }
            }, { 
            	type: 'Category',
                position: 'bottom',
                fields: ['date'],
                label: {
                    renderer: function() {
                    	return "";
					}
                }
            }],
            series: [{
                type: 'column',
                axis: 'left',
                color: "blue",
                label: {
                  	display: 'middle',
                  	'text-anchor': 'middle',
                    field: 'hits',
                    renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horiztonal',
                    color: '#333'
                },
                xField: 'date',
                yField: 'hits'
            }]
		});
		
		this.callParent(arguments);
		
		this.socket.on({
			hits: function(cmp, data) {
				this.updateChart(data);
			},
			scope: this
		});
	},
	
	buildStore: function() {
		return Ext.create("Ext.data.JsonStore", {
			fields: [
				{ name: "date", type: "datetime" }, 
				{ name: "hits", type: "int" }
			],
			data: this.generateData()
	    });
	},
	
	generateData: function() {
		var data = [],
			date = Ext.Date.add(new Date(), Ext.Date.SECOND, (10 * 10)),
			i = 0;
			
		for(i = 0; i < 10; i++) {
			data.push({
            	date: Ext.Date.add(date, Ext.Date.SECOND, (i * 10)),
                hits: 0// min(100, max(last ? last.hits + (random() - 0.5) * 20 : random() * 100, 0))
            });
		}
		
		return data;
    },
    
    updateChart: function(data) {	
	    this.store.removeAt(0);
		this.store.add({
			date: new Date(),
			hits: data.hits
		});
    }
});
	
            
