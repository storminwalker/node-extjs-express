
Ext.define("ToDoIt.view.todo.Show", {
	extend: "Ext.panel.Panel",
	alias: "widget.todoshow",

    requires: [
        "ToDoIt.view.todo.Grid"
    ],

	closable: false,
	
	layout: {
		type: 'fit'
	},

	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'todogrid',
				flex: 1
			}]
		});

		this.callParent(arguments);
	}
});

